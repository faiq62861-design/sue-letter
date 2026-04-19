import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import AccessControl "mo:caffeineai-authorization/access-control";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Common "../types/common";
import LetterTypes "../types/letters";
import UserTypes "../types/users";
import LetterLib "../lib/letters";
import UserLib "../lib/users";
import AiLib "../lib/ai";

mixin (
  accessControlState : AccessControl.AccessControlState,
  letters            : Map.Map<Common.LetterId, LetterTypes.GeneratedLetter>,
  userProfiles       : Map.Map<Principal, UserTypes.UserProfile>,
  getTransform       : () -> OutCall.Transform,
  auditLog           : List.List<(Common.Timestamp, Text, Text, Text)>,
) {

  // ── Claude API constants ──────────────────────────────────────────────────
  let CLAUDE_MODEL    = "claude-sonnet-4-5";
  let CLAUDE_API_URL  = "https://api.anthropic.com/v1/messages";
  let MAX_TOKENS_TEXT = "4096";

  // ── Rate limiting constants ───────────────────────────────────────────────
  // Per-user: max 3 generations per 60 seconds
  let RATE_WINDOW_NS     : Int = 60_000_000_000;     // 60 seconds in nanoseconds
  let RATE_MAX_PER_WINDOW : Nat = 3;
  // Global: max 100 Claude API calls per hour
  let GLOBAL_WINDOW_NS   : Int = 3_600_000_000_000;  // 1 hour in nanoseconds
  let GLOBAL_HOURLY_CAP  : Nat = 100;

  // Anthropic API key storage
  let anthropicConfig = { var apiKey : ?Text = null };

  // Per-user rate limit tracking: caller → [timestamp of recent calls]
  let userRateLimits : Map.Map<Principal, List.List<Common.Timestamp>> = Map.empty();

  // Global hourly counter: (windowStartNs, callCount)
  let globalRateState = { var windowStart : Int = 0; var count : Nat = 0 };

  // ── Audit logging helper ──────────────────────────────────────────────────

  func logAudit(caller : Principal, action : Text, outcome : Text) {
    let entry : (Common.Timestamp, Text, Text, Text) = (
      Time.now(),
      caller.toText(),
      action,
      outcome,
    );
    auditLog.add(entry);
    // Keep audit log from growing unbounded (retain last 5000 entries)
    if (auditLog.size() > 5000) {
      ignore auditLog.removeLast();
    };
  };

  // ── Per-user rate limit check ─────────────────────────────────────────────

  /// Returns true if caller is within their rate limit, false if exceeded.
  func checkUserRateLimit(caller : Principal, now : Int) : Bool {
    let existing = switch (userRateLimits.get(caller)) {
      case (?ts) { ts };
      case null  { List.empty<Common.Timestamp>() };
    };
    // Keep only timestamps within the current window
    let windowStart = now - RATE_WINDOW_NS;
    let recent = existing.filter(func(t : Common.Timestamp) : Bool { t > windowStart });
    if (recent.size() >= RATE_MAX_PER_WINDOW) {
      return false;
    };
    // Record this call
    recent.add(now);
    userRateLimits.add(caller, recent);
    true
  };

  // ── Global hourly rate limit check ────────────────────────────────────────

  /// Returns true if global cap not yet reached, false if exceeded.
  func checkGlobalRateLimit(now : Int) : Bool {
    if (now - globalRateState.windowStart > GLOBAL_WINDOW_NS) {
      // New hour window — reset
      globalRateState.windowStart := now;
      globalRateState.count := 0;
    };
    if (globalRateState.count >= GLOBAL_HOURLY_CAP) {
      return false;
    };
    globalRateState.count += 1;
    true
  };

  /// Set the Anthropic API key (admin only).
  public shared ({ caller }) func setAnthropicKey(key : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can set the Anthropic API key");
    };
    anthropicConfig.apiKey := ?key;
    // Log key TYPE only — never the key value
    logAudit(caller, "admin_key_updated", "anthropic_api_key");
  };

  /// Check whether the Anthropic API key has been configured.
  public query func isAnthropicConfigured() : async Bool {
    anthropicConfig.apiKey != null;
  };

  // ── Internal Claude caller ────────────────────────────────────────────────

  func callClaude(prompt : Text) : async Text {
    let apiKey = switch (anthropicConfig.apiKey) {
      case (null) { Runtime.trap("Anthropic API key not configured") };
      case (?k)   { k };
    };
    let body = "{\"model\":\"" # CLAUDE_MODEL # "\"," #
               "\"max_tokens\":" # MAX_TOKENS_TEXT # "," #
               "\"messages\":[{\"role\":\"user\",\"content\":" #
               AiLib.escapeJson(prompt) # "}]}";

    let headers : [OutCall.Header] = [
      { name = "x-api-key";         value = apiKey },
      { name = "anthropic-version"; value = "2023-06-01" },
      { name = "content-type";      value = "application/json" },
    ];

    await OutCall.httpPostRequest(CLAUDE_API_URL, headers, body, getTransform());
  };

  /// Extract text content from a Claude API response JSON.
  func extractClaudeText(raw : Text) : Text {
    let dq = Text.fromChar('\u{22}');
    let marker = dq # "text" # dq # ":" # dq;
    let parts = raw.split(#text marker);
    var isFirst = true;
    var result = "Unable to extract response";
    parts.forEach(func(part : Text) {
      if (isFirst) {
        isFirst := false;
      } else if (result == "Unable to extract response") {
        let chars = part.toArray();
        var i = 0;
        var extracted = "";
        var done = false;
        while (i < chars.size() and not done) {
          let c = chars[i];
          if (c == '\u{22}' and (i == 0 or chars[i - 1] != '\\')) {
            done := true;
          } else if (c == '\\' and i + 1 < chars.size()) {
            let next = chars[i + 1];
            if (next == '\u{22}') {
              extracted #= dq;
              i += 1;
            } else if (next == 'n') {
              extracted #= "\n";
              i += 1;
            } else if (next == 't') {
              extracted #= "\t";
              i += 1;
            } else if (next == '\\') {
              extracted #= "\\";
              i += 1;
            } else {
              extracted #= Text.fromChar(c);
            };
          } else {
            extracted #= Text.fromChar(c);
          };
          i += 1;
        };
        if (extracted.size() > 0) {
          result := extracted;
        };
      };
    });
    result;
  };

  // ── Letter generation ─────────────────────────────────────────────────────

  /// Generate a full demand letter via Claude AI.
  /// country: optional ISO 3166-1 alpha-2 country code (e.g. "US", "GB").
  /// Passed separately from formData so it does NOT affect stable canister state.
  public shared ({ caller }) func generateLetterStream(
    formData : LetterTypes.LetterFormData,
    country  : ?Text,
  ) : async Common.Result<Text, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let now = Time.now();

    // Per-user rate limit
    if (not checkUserRateLimit(caller, now)) {
      let msg = "Rate limit exceeded — please wait before generating another letter.";
      logAudit(caller, "letter_generated", msg);
      return #err(msg);
    };

    // Global hourly cap
    if (not checkGlobalRateLimit(now)) {
      let msg = "Service capacity limit reached — please try again in a few minutes.";
      logAudit(caller, "letter_generated", msg);
      return #err(msg);
    };

    // Check quota
    switch (userProfiles.get(caller)) {
      case (?profile) {
        let fresh = UserLib.refreshMonthIfNeeded(profile, now);
        if (not UserLib.canGenerate(fresh, now)) {
          let reason = UserLib.blockedReason(fresh, now);
          logAudit(caller, "letter_generated", reason);
          return #err(reason);
        };
      };
      case (null) { /* new user — allow */ };
    };
    let prompt  = AiLib.buildLetterPrompt(formData, country);
    let raw     = await callClaude(prompt);
    let content = extractClaudeText(raw);
    if (content == "Unable to extract response") {
      let msg = "Failed to generate letter. Please try again.";
      logAudit(caller, "letter_generated", msg);
      #err(msg);
    } else {
      logAudit(caller, "letter_generated", "success");
      #ok(content);
    };
  };

  /// Generate an escalated follow-up letter based on an existing letter.
  public shared ({ caller }) func generateFollowUpLetter(
    originalLetterId : Common.LetterId,
  ) : async Common.Result<Text, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let now = Time.now();

    // Per-user rate limit
    if (not checkUserRateLimit(caller, now)) {
      return #err("Rate limit exceeded — please wait before generating another letter.");
    };

    // Global hourly cap
    if (not checkGlobalRateLimit(now)) {
      return #err("Service capacity limit reached — please try again in a few minutes.");
    };

    let userId = caller.toText();
    let original = switch (letters.get(originalLetterId)) {
      case (null)    { return #err("Original letter not found") };
      case (?letter) {
        if (not LetterLib.isOwner(letter, userId)) {
          return #err("Unauthorized: you do not own this letter");
        };
        letter;
      };
    };
    let prompt  = AiLib.buildFollowUpPrompt(original);
    let raw     = await callClaude(prompt);
    let content = extractClaudeText(raw);
    if (content == "Unable to extract response") {
      #err("Failed to generate follow-up letter. Please try again.");
    } else {
      #ok(content);
    };
  };

  // ── Analysis ──────────────────────────────────────────────────────────────

  /// Analyse the strength of a saved letter via Claude AI.
  public shared ({ caller }) func generateStrengthAnalysis(
    letterId : Common.LetterId,
  ) : async Common.Result<LetterTypes.StrengthAnalysis, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let now = Time.now();

    // Per-user rate limit
    if (not checkUserRateLimit(caller, now)) {
      return #err("Rate limit exceeded — please wait before generating another letter.");
    };

    // Global hourly cap
    if (not checkGlobalRateLimit(now)) {
      return #err("Service capacity limit reached — please try again in a few minutes.");
    };

    let userId = caller.toText();
    let letter = switch (letters.get(letterId)) {
      case (null) { return #err("Letter not found") };
      case (?l)   {
        if (not LetterLib.isOwner(l, userId)) {
          return #err("Unauthorized: you do not own this letter");
        };
        l;
      };
    };
    let prompt = AiLib.buildStrengthPrompt(letter);
    let raw    = await callClaude(prompt);
    switch (AiLib.parseStrengthResponse(raw)) {
      case (#ok(analysis)) { #ok(analysis) };
      case (#err(msg))     { #err("Failed to parse analysis: " # msg) };
    };
  };

  // ── Q&A assistant ─────────────────────────────────────────────────────────

  /// Answer a user question in the context of a specific letter.
  public shared ({ caller }) func answerQuestion(
    question : Text,
    letterId : Common.LetterId,
  ) : async Common.Result<Text, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    // Validate question length
    if (question.size() > AiLib.MAX_DESCRIPTION_LEN) {
      return #err("Question exceeds maximum allowed length of " # AiLib.MAX_DESCRIPTION_LEN.toText() # " characters.");
    };
    let now = Time.now();

    // Per-user rate limit
    if (not checkUserRateLimit(caller, now)) {
      return #err("Rate limit exceeded — please wait before generating another letter.");
    };

    // Global hourly cap
    if (not checkGlobalRateLimit(now)) {
      return #err("Service capacity limit reached — please try again in a few minutes.");
    };

    let userId = caller.toText();
    let letter = switch (letters.get(letterId)) {
      case (null) { return #err("Letter not found") };
      case (?l)   {
        if (not LetterLib.isOwner(l, userId)) {
          return #err("Unauthorized: you do not own this letter");
        };
        l;
      };
    };
    let prompt = AiLib.buildQaPrompt(question, letter);
    let raw    = await callClaude(prompt);
    let answer = extractClaudeText(raw);
    if (answer == "Unable to extract response") {
      #err("Failed to get an answer. Please try again.");
    } else {
      #ok(answer);
    };
  };
};
