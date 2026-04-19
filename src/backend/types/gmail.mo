import Common "common";

module {
  // ── Gmail OAuth2 token storage ────────────────────────────────────────────

  public type GmailToken = {
    accessToken  : Text;
    refreshToken : Text;
    expiresAt    : Common.Timestamp; // nanoseconds since epoch
  };

  // ── Send result ───────────────────────────────────────────────────────────

  public type SendResult = Common.Result<(), Text>;
};
