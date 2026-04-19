import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Stripe "mo:caffeineai-stripe/stripe";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import UserTypes "../types/users";
import UserLib "../lib/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles       : Map.Map<Principal, UserTypes.UserProfile>,
  stripeConfig       : { var value : ?Stripe.StripeConfiguration },
  auditLog           : List.List<(Common.Timestamp, Text, Text, Text)>,
) {

  // ── Audit logging helper ──────────────────────────────────────────────────

  func logStripeAudit(caller : Principal, action : Text, outcome : Text) {
    let entry : (Common.Timestamp, Text, Text, Text) = (
      Time.now(),
      caller.toText(),
      action,
      outcome,
    );
    auditLog.add(entry);
  };

  // ── Plan management ───────────────────────────────────────────────────────

  /// Update a user's plan after successful Stripe payment (admin only).
  public shared ({ caller }) func updateUserPlan(
    userId : Common.UserId,
    plan   : UserTypes.StripePlan,
  ) : async Common.Result<Bool, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update user plans");
    };
    let planName = switch (plan) {
      case (#Pro)      { "Pro" };
      case (#Business) { "Business" };
    };
    // Find user by userId text — scan profiles
    var found = false;
    userProfiles.forEach(func(principal : Principal, profile : UserTypes.UserProfile) {
      if (profile.userId == userId) {
        found := true;
        let newPlan : UserTypes.UserPlan = switch (plan) {
          case (#Pro)      { #Pro };
          case (#Business) { #Business };
        };
        let updated = UserLib.applyPlan(profile, newPlan);
        userProfiles.add(principal, updated);
      };
    });
    if (found) {
      logStripeAudit(caller, "plan_changed", planName);
      #ok(true);
    } else {
      #err("User not found: " # userId);
    };
  };
};
