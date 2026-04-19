import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Blob "mo:core/Blob";
import Text "mo:core/Text";
import Char "mo:core/Char";
import Nat8 "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Error "mo:core/Error";
import AccessControl "mo:caffeineai-authorization/access-control";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Common "../types/common";
import GmailTypes "../types/gmail";
import UserTypes "../types/users";
import UserLib "../lib/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  gmailTokens        : Map.Map<Principal, GmailTypes.GmailToken>,
  userProfiles       : Map.Map<Principal, UserTypes.UserProfile>,
  getTransform       : () -> OutCall.Transform,
) {

  // ── Base64url encoding ────────────────────────────────────────────────────

  /// ASCII codes of the base64url alphabet (RFC 4648 §5 — URL-safe, no padding).
  /// Index 0-63 maps to: A-Z (0-25), a-z (26-51), 0-9 (52-61), - (62), _ (63).
  let B64_CHARS : [Nat8] = [
    65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77,  // A-M
    78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,  // N-Z
    97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107,   // a-k
    108, 109, 110, 111, 112, 113, 114, 115, 116, 117,     // l-u
    118, 119, 120, 121, 122,                               // v-z
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57,               // 0-9
    45, 95,                                                // '-' '_'
  ];

  /// Convert a 6-bit index (0-63) into its base64url character.
  func b64Char(idx : Nat) : Text {
    let code = B64_CHARS[idx].toNat();
    Char.fromNat32(Nat32.fromNat(code)).toText();
  };

  /// Encode arbitrary bytes as base64url (no padding) — required by the Gmail API.
  func base64urlEncode(input : Text) : Text {
    let bytes = input.encodeUtf8().toArray();
    let n     = bytes.size();
    var out   : Text = "";
    var i     : Nat  = 0;

    while (i + 2 < n) {
      let b0 = bytes[i].toNat();
      let b1 = bytes[i + 1].toNat();
      let b2 = bytes[i + 2].toNat();
      out #= b64Char(b0 / 4);
      out #= b64Char((b0 % 4) * 16 + b1 / 16);
      out #= b64Char((b1 % 16) * 4 + b2 / 64);
      out #= b64Char(b2 % 64);
      i += 3;
    };

    // Handle remaining 1 or 2 bytes (no padding appended)
    if (i + 1 == n) {
      let b0 = bytes[i].toNat();
      out #= b64Char(b0 / 4);
      out #= b64Char((b0 % 4) * 16);
    } else if (i + 2 == n) {
      let b0 = bytes[i].toNat();
      let b1 = bytes[i + 1].toNat();
      out #= b64Char(b0 / 4);
      out #= b64Char((b0 % 4) * 16 + b1 / 16);
      out #= b64Char((b1 % 16) * 4);
    };

    out;
  };

  /// Build a minimal RFC 2822 plaintext email and return it base64url-encoded.
  func buildRfc2822(toEmail : Text, subject : Text, body : Text) : Text {
    let raw =
      "To: " # toEmail # "\r\n" #
      "Subject: " # subject # "\r\n" #
      "MIME-Version: 1.0\r\n" #
      "Content-Type: text/plain; charset=\"UTF-8\"\r\n" #
      "\r\n" #
      body;
    base64urlEncode(raw);
  };

  // ── Public API ─────────────────────────────────────────────────────────────

  /// Store or replace the Gmail OAuth2 tokens for the authenticated caller.
  public shared ({ caller }) func storeGmailToken(
    accessToken  : Text,
    refreshToken : Text,
    expiresAt    : Int,
  ) : async Common.Result<(), Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    let token : GmailTypes.GmailToken = { accessToken; refreshToken; expiresAt };
    gmailTokens.add(caller, token);
    #ok(());
  };

  /// Return the stored Gmail OAuth2 token for the caller, or null if not connected.
  public query ({ caller }) func getGmailToken() : async ?GmailTypes.GmailToken {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    gmailTokens.get(caller);
  };

  /// Send a demand letter via the Gmail API using the caller's stored OAuth2 token.
  ///
  /// Access rules:
  ///   - Anonymous callers → #err("Unauthorized")
  ///   - No Gmail token stored → #err("No Gmail token…")
  ///   - Free plan users who have generated MORE than FREE_MONTHLY_LIMIT letters
  ///     → #err("upgradeRequired: …") so the frontend can show the upgrade prompt
  ///   - Pro / Business / PayPerLetter → no send restriction
  public shared ({ caller }) func sendLetterViaGmail(
    recipientEmail : Text,
    letterContent  : Text,
    subject        : Text,
  ) : async Common.Result<(), Text> {
    // 1. Auth check
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };

    // 2. Gmail token check
    let token = switch (gmailTokens.get(caller)) {
      case (null) {
        return #err("No Gmail token stored. Please connect your Gmail account first.");
      };
      case (?t) { t };
    };

    // 3. Quota check — Free-tier users may only send within the 2-letter free quota
    let now = Time.now();
    switch (userProfiles.get(caller)) {
      case (?profile) {
        let fresh = UserLib.refreshMonthIfNeeded(profile, now);
        switch (fresh.plan) {
          case (#Free) {
            if (fresh.lettersThisMonth > UserTypes.FREE_MONTHLY_LIMIT) {
              return #err(
                "upgradeRequired: You have used your " #
                UserTypes.FREE_MONTHLY_LIMIT.toText() #
                " free letters this month. Upgrade to Pro to continue sending via Gmail.",
              );
            };
          };
          case (_) { /* paid tiers — unrestricted */ };
        };
      };
      case (null) {
        // No profile yet → treat as a fresh Free user; first letter is always allowed
      };
    };

    // 4. Build RFC 2822 message (base64url-encoded) and POST to Gmail API
    let rawMessage  = buildRfc2822(recipientEmail, subject, letterContent);
    let requestBody = "{\"raw\":\"" # rawMessage # "\"}";

    let headers : [OutCall.Header] = [
      { name = "Authorization"; value = "Bearer " # token.accessToken },
      { name = "Content-Type";  value = "application/json" },
    ];

    let url = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

    let response = try {
      await OutCall.httpPostRequest(url, headers, requestBody, getTransform());
    } catch (e) {
      return #err("HTTP outcall failed: " # e.message());
    };

    // Gmail API returns a JSON body containing "id" on success (HTTP 200).
    if (response.contains(#text "\"id\"")) {
      #ok(());
    } else {
      #err("Gmail API error: " # response);
    };
  };
};
