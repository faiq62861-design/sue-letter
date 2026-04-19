import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import LetterTypes "../types/letters";
import UserTypes "../types/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles       : Map.Map<Principal, UserTypes.UserProfile>,
  letters            : Map.Map<Common.LetterId, LetterTypes.GeneratedLetter>,
  auditLog           : List.List<(Common.Timestamp, Text, Text, Text)>,
) {

  /// Return high-level platform statistics (admin only).
  public query ({ caller }) func getAdminStats() : async {
    totalUsers           : Nat;
    totalLetters         : Nat;
    activeSubscriptions  : Nat;
  } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let totalUsers  = userProfiles.size();
    let totalLetters = letters.size();
    var activeSubscriptions = 0;
    userProfiles.forEach(func(_ : Principal, profile : UserTypes.UserProfile) {
      switch (profile.plan) {
        case (#Pro)      { activeSubscriptions += 1 };
        case (#Business) { activeSubscriptions += 1 };
        case (#Free)     {};
        case (#PayPerLetter) {};
      };
    });
    { totalUsers; totalLetters; activeSubscriptions };
  };

  /// Return the last 500 audit log entries (admin only).
  /// Each entry is (timestamp, callerPrincipal, action, outcome).
  public query ({ caller }) func getAuditLog() : async [(Common.Timestamp, Text, Text, Text)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let total = auditLog.size();
    let startIdx : Int = if (total > 500) total - 500 else 0;
    auditLog.sliceToArray(startIdx, total)
  };
};
