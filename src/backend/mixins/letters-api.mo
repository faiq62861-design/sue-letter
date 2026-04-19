import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import AccessControl "mo:caffeineai-authorization/access-control";
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
  letterCounter      : { var value : Nat },
) {

  // ── Input validation ──────────────────────────────────────────────────────

  /// Validate all text fields in a LetterFormData. Returns null on success,
  /// or an error message on the first violation found.
  func validateFormData(fd : LetterTypes.LetterFormData) : ?Text {
    if (fd.senderName.size() > AiLib.MAX_NAME_LEN) {
      let msg = "Sender name exceeds maximum length of " # AiLib.MAX_NAME_LEN.toText() # " characters.";
      return ?msg;
    };
    if (fd.recipientName.size() > AiLib.MAX_NAME_LEN) {
      let msg = "Recipient name exceeds maximum length of " # AiLib.MAX_NAME_LEN.toText() # " characters.";
      return ?msg;
    };
    if (fd.senderEmail.size() > AiLib.MAX_EMAIL_LEN) {
      let msg = "Sender email exceeds maximum length of " # AiLib.MAX_EMAIL_LEN.toText() # " characters.";
      return ?msg;
    };
    if (fd.disputeDescription.size() > AiLib.MAX_DESCRIPTION_LEN) {
      let msg = "Dispute description exceeds maximum length of " # AiLib.MAX_DESCRIPTION_LEN.toText() # " characters.";
      return ?msg;
    };
    if (fd.preferredResolution.size() > AiLib.MAX_DESCRIPTION_LEN) {
      let msg = "Preferred resolution exceeds maximum length of " # AiLib.MAX_DESCRIPTION_LEN.toText() # " characters.";
      return ?msg;
    };
    if (fd.deadlineDays > AiLib.MAX_DEADLINE_DAYS) {
      let msg = "Deadline exceeds maximum of " # AiLib.MAX_DEADLINE_DAYS.toText() # " days.";
      return ?msg;
    };
    // Validate evidence items
    for (item in fd.evidenceItems.vals()) {
      if (item.size() > AiLib.MAX_AMOUNT_DESC_LEN) {
        let msg = "An evidence item exceeds maximum length of " # AiLib.MAX_AMOUNT_DESC_LEN.toText() # " characters.";
        return ?msg;
      };
    };
    null
  };

  /// Persist a generated letter for the authenticated user.
  public shared ({ caller }) func saveLetter(
    formData      : LetterTypes.LetterFormData,
    letterContent : Text,
  ) : async Common.Result<LetterTypes.GeneratedLetter, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };

    // Input validation
    switch (validateFormData(formData)) {
      case (?errMsg) { return #err(errMsg) };
      case null {};
    };
    if (letterContent.size() > 50_000) {
      return #err("Letter content exceeds maximum allowed size.");
    };

    let now    = Time.now();
    let userId = caller.toText();

    // Check quota
    let profile = switch (userProfiles.get(caller)) {
      case (null) {
        // Auto-create profile if not exists
        let p = UserLib.newProfile(userId, null, now);
        userProfiles.add(caller, p);
        p;
      };
      case (?p) { UserLib.refreshMonthIfNeeded(p, now) };
    };

    if (not UserLib.canGenerate(profile, now)) {
      return #err(UserLib.blockedReason(profile, now));
    };

    // Generate ID
    letterCounter.value += 1;
    let letterId = LetterLib.generateId(letterCounter.value, userId);

    // Build and store letter
    let letter = LetterLib.buildLetter(letterId, userId, formData, letterContent, now, false, null);
    letters.add(letterId, letter);

    // Update user counters
    let updated = UserLib.recordLetterGenerated(profile, now);
    userProfiles.add(caller, updated);

    #ok(letter);
  };

  /// Return all letters owned by the calling user, sorted newest first.
  public query ({ caller }) func getUserLetters() : async [LetterTypes.GeneratedLetter] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let userId = caller.toText();
    let owned = letters.values()
      .filter(func(l : LetterTypes.GeneratedLetter) : Bool { LetterLib.isOwner(l, userId) })
      .toArray();
    // Sort by createdAt descending
    owned.sort(func(a : LetterTypes.GeneratedLetter, b : LetterTypes.GeneratedLetter) : Order.Order {
      if (a.createdAt > b.createdAt) #less
      else if (a.createdAt < b.createdAt) #greater
      else #equal
    });
  };

  /// Return a single letter by ID (caller must own it).
  public query ({ caller }) func getLetter(id : Common.LetterId) : async ?LetterTypes.GeneratedLetter {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let userId = caller.toText();
    switch (letters.get(id)) {
      case (null)     { null };
      case (?letter)  {
        if (LetterLib.isOwner(letter, userId)) ?letter else null
      };
    };
  };

  /// Update the status of a letter owned by the caller.
  public shared ({ caller }) func updateLetterStatus(
    id     : Common.LetterId,
    status : LetterTypes.LetterStatus,
  ) : async Common.Result<Bool, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let userId = caller.toText();
    switch (letters.get(id)) {
      case (null) { #err("Letter not found") };
      case (?letter) {
        if (not LetterLib.isOwner(letter, userId)) {
          return #err("Unauthorized: you do not own this letter");
        };
        letters.add(id, LetterLib.withStatus(letter, status));
        #ok(true);
      };
    };
  };

  /// Remove a letter owned by the calling user.
  public shared ({ caller }) func deleteLetterForUser(
    id : Common.LetterId,
  ) : async Common.Result<Bool, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let userId = caller.toText();
    switch (letters.get(id)) {
      case (null) { #err("Letter not found") };
      case (?letter) {
        if (not LetterLib.isOwner(letter, userId)) {
          return #err("Unauthorized: you do not own this letter");
        };
        letters.remove(id);
        #ok(true);
      };
    };
  };

  /// Record a download event for a letter owned by the caller.
  /// Increments downloadCount and sets lastDownloadAt to the current time.
  public shared ({ caller }) func recordDownload(
    id : Common.LetterId,
  ) : async Common.Result<Bool, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let userId = caller.toText();
    switch (letters.get(id)) {
      case (null) { #err("Letter not found") };
      case (?letter) {
        if (not LetterLib.isOwner(letter, userId)) {
          return #err("Unauthorized: you do not own this letter");
        };
        letters.add(id, LetterLib.withDownload(letter, Time.now()));
        #ok(true);
      };
    };
  };
};
