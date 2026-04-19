import Common "../types/common";
import Types "../types/letters";
import Text "mo:core/Text";

module {
  // ── Letter ID generation ──────────────────────────────────────────────────

  /// Generate a unique letter ID: "letter_<counter>_<first8charsOfCaller>"
  public func generateId(counter : Nat, callerText : Text) : Common.LetterId {
    let prefix = if (callerText.size() >= 8) {
      Text.fromIter(callerText.toIter().take(8))
    } else {
      callerText
    };
    "letter_" # counter.toText() # "_" # prefix;
  };

  // ── Letter construction ───────────────────────────────────────────────────

  /// Build a new GeneratedLetter record from raw inputs.
  public func buildLetter(
    id         : Common.LetterId,
    userId     : Common.UserId,
    formData   : Types.LetterFormData,
    content    : Text,
    createdAt  : Common.Timestamp,
    isFollowUp : Bool,
    originalId : ?Common.LetterId,
  ) : Types.GeneratedLetter {
    {
      id;
      userId;
      formData;
      letterContent    = content;
      createdAt;
      status           = #Draft;
      isFollowUp;
      originalLetterId = originalId;
      downloadCount    = 0;
      lastDownloadAt   = null;
    };
  };

  // ── Letter ownership check ────────────────────────────────────────────────

  /// Return true when the given userId owns the letter.
  public func isOwner(letter : Types.GeneratedLetter, userId : Common.UserId) : Bool {
    letter.userId == userId;
  };

  // ── Status update ─────────────────────────────────────────────────────────

  /// Return a copy of the letter with the status field updated.
  public func withStatus(
    letter : Types.GeneratedLetter,
    status : Types.LetterStatus,
  ) : Types.GeneratedLetter {
    { letter with status };
  };

  // ── Download tracking ─────────────────────────────────────────────────────

  /// Return a copy of the letter with downloadCount incremented and lastDownloadAt set.
  public func withDownload(
    letter : Types.GeneratedLetter,
    now    : Int,
  ) : Types.GeneratedLetter {
    { letter with downloadCount = letter.downloadCount + 1; lastDownloadAt = ?now };
  };
};
