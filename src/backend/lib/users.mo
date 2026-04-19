import Common "../types/common";
import Types "../types/users";
import Int "mo:core/Int";
import Nat "mo:core/Nat";

module {
  // ── Profile construction ──────────────────────────────────────────────────

  /// Create a brand-new UserProfile for a first-time caller.
  public func newProfile(userId : Common.UserId, email : ?Text, createdAt : Common.Timestamp) : Types.UserProfile {
    {
      userId;
      email;
      plan             = #Free;
      lettersThisMonth = 0;
      totalLetters     = 0;
      currentMonthYear = monthKey(createdAt);
      stripeCustomerId     = null;
      stripeSubscriptionId = null;
      createdAt;
    };
  };

  // ── Month tracking ────────────────────────────────────────────────────────

  /// Return a "YYYY-MM" string derived from a nanosecond timestamp.
  public func monthKey(ts : Common.Timestamp) : Text {
    // ts is nanoseconds (Int); work with absolute value in Nat
    let seconds : Nat = Int.abs(ts) / 1_000_000_000;
    // Days since Unix epoch (1970-01-01)
    let days : Nat = seconds / 86400;
    // Civil-calendar algorithm (all-positive Gregorian, works for 1970+)
    let z : Nat = days + 719468;
    let era : Nat = z / 146097;
    let doe : Nat = z - era * 146097;
    let yoe : Nat = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y   : Nat = yoe + era * 400;
    let doy : Nat = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp  : Nat = (5 * doy + 2) / 153;
    let m   : Nat = if (mp < 10) mp + 3 else mp - 9;
    let year : Nat = if (m <= 2) y + 1 else y;

    let yearText  = year.toText();
    let monthText = if (m < 10) "0" # m.toText() else m.toText();
    yearText # "-" # monthText;
  };

  /// Reset monthly counter if the stored month key differs from the current one.
  public func refreshMonthIfNeeded(profile : Types.UserProfile, now : Common.Timestamp) : Types.UserProfile {
    let current = monthKey(now);
    if (profile.currentMonthYear == current) {
      profile;
    } else {
      { profile with lettersThisMonth = 0; currentMonthYear = current };
    };
  };

  // ── Usage / quota ─────────────────────────────────────────────────────────

  /// Return true when the caller is allowed to generate another letter right now.
  public func canGenerate(profile : Types.UserProfile, now : Common.Timestamp) : Bool {
    let fresh = refreshMonthIfNeeded(profile, now);
    switch (fresh.plan) {
      case (#Pro)          { true };
      case (#Business)     { true };
      case (#PayPerLetter) { true };
      case (#Free)         { fresh.lettersThisMonth < Types.FREE_MONTHLY_LIMIT };
    };
  };

  /// How many more free letters the user can generate this month.
  /// Returns a large sentinel (999) for paid tiers to indicate "unlimited".
  public func remaining(profile : Types.UserProfile, now : Common.Timestamp) : Nat {
    let fresh = refreshMonthIfNeeded(profile, now);
    switch (fresh.plan) {
      case (#Pro)          { 999 };
      case (#Business)     { 999 };
      case (#PayPerLetter) { 999 };
      case (#Free) {
        if (fresh.lettersThisMonth >= Types.FREE_MONTHLY_LIMIT) 0
        else Types.FREE_MONTHLY_LIMIT - fresh.lettersThisMonth;
      };
    };
  };

  /// Human-readable reason why generation is blocked (empty string if allowed).
  public func blockedReason(profile : Types.UserProfile, now : Common.Timestamp) : Text {
    let fresh = refreshMonthIfNeeded(profile, now);
    switch (fresh.plan) {
      case (#Pro)          { "" };
      case (#Business)     { "" };
      case (#PayPerLetter) { "" };
      case (#Free) {
        if (fresh.lettersThisMonth >= Types.FREE_MONTHLY_LIMIT) {
          "You have reached your free limit of " # Types.FREE_MONTHLY_LIMIT.toText() #
          " letters this month. Upgrade to Pro for unlimited letters."
        } else { "" };
      };
    };
  };

  // ── Profile mutations ─────────────────────────────────────────────────────

  /// Increment letter counters and return updated profile.
  public func recordLetterGenerated(profile : Types.UserProfile, now : Common.Timestamp) : Types.UserProfile {
    let fresh = refreshMonthIfNeeded(profile, now);
    {
      fresh with
      lettersThisMonth = fresh.lettersThisMonth + 1;
      totalLetters     = fresh.totalLetters + 1;
    };
  };

  /// Apply a new subscription plan to the profile.
  public func applyPlan(profile : Types.UserProfile, plan : Types.UserPlan) : Types.UserProfile {
    { profile with plan };
  };

  /// Store Stripe IDs on the profile.
  public func applyStripeIds(
    profile    : Types.UserProfile,
    customerId : ?Text,
    subId      : ?Text,
  ) : Types.UserProfile {
    { profile with stripeCustomerId = customerId; stripeSubscriptionId = subId };
  };
};
