import Common "common";

module {
  // ── Subscription / billing plan ───────────────────────────────────────────

  public type UserPlan = {
    #Free;
    #Pro;          // $9.99 / month
    #Business;     // $29 / month
    #PayPerLetter; // $2.99 one-off
  };

  // Free-tier monthly limit (2 letters/month)
  public let FREE_MONTHLY_LIMIT : Nat = 2;

  // ── User profile ──────────────────────────────────────────────────────────

  public type UserProfile = {
    userId               : Common.UserId;
    email                : ?Text;
    plan                 : UserPlan;
    lettersThisMonth     : Nat;
    totalLetters         : Nat;
    currentMonthYear     : Text; // "YYYY-MM" — resets counter when month changes
    stripeCustomerId     : ?Text;
    stripeSubscriptionId : ?Text;
    createdAt            : Common.Timestamp;
  };

  // ── Stripe plan selector (used in checkout calls) ─────────────────────────

  public type StripePlan = {
    #Pro;
    #Business;
  };
};
