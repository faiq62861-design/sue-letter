import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import UserTypes "../types/users";
import UserLib "../lib/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles       : Map.Map<Principal, UserTypes.UserProfile>,
) {

  /// Return the UserProfile for the authenticated caller, or null if not registered.
  public query ({ caller }) func getUserProfile() : async ?UserTypes.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.get(caller);
  };

  /// Upsert user profile — creates on first call, updates email on subsequent calls.
  public shared ({ caller }) func createOrUpdateUser(
    email : ?Text,
  ) : async UserTypes.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let now = Time.now();
    let userId = caller.toText();
    let profile = switch (userProfiles.get(caller)) {
      case (null) {
        UserLib.newProfile(userId, email, now);
      };
      case (?existing) {
        let refreshed = UserLib.refreshMonthIfNeeded(existing, now);
        // Update email if provided
        switch (email) {
          case (null) { refreshed };
          case (?e)   { { refreshed with email = ?e } };
        };
      };
    };
    userProfiles.add(caller, profile);
    profile;
  };

  /// Check whether the caller is allowed to generate a letter right now.
  public query ({ caller }) func canGenerateLetter() : async {
    canGenerate : Bool;
    reason      : Text;
    remaining   : Nat;
  } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let now = Time.now();
    switch (userProfiles.get(caller)) {
      case (null) {
        // No profile yet — treat as fresh free user
        {
          canGenerate = true;
          reason      = "";
          remaining   = UserTypes.FREE_MONTHLY_LIMIT;
        };
      };
      case (?profile) {
        let fresh  = UserLib.refreshMonthIfNeeded(profile, now);
        let can    = UserLib.canGenerate(fresh, now);
        let rem    = UserLib.remaining(fresh, now);
        let reason = UserLib.blockedReason(fresh, now);
        { canGenerate = can; reason; remaining = rem };
      };
    };
  };
};
