import Common "common";

module {
  /// A partnership / meeting-request record stored in the canister.
  public type PartnershipRequest = {
    id            : Text;
    name          : Text;
    email         : Text;
    company       : Text;
    message       : Text;
    preferredDate : Text;
    preferredTime : Text;
    /// "submitted" | "reviewed" | "scheduled" | "rejected"
    status        : Text;
    createdAt     : Common.Timestamp;
  };

  /// Fields a visitor supplies when submitting a partnership request.
  public type CreatePartnershipRequestInput = {
    name          : Text;
    email         : Text;
    company       : Text;
    message       : Text;
    preferredDate : Text;
    preferredTime : Text;
  };
};
