import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import PartnershipTypes "../types/partnership";

mixin (
  accessControlState   : AccessControl.AccessControlState,
  partnershipRequests  : Map.Map<Text, PartnershipTypes.PartnershipRequest>,
  partnershipCounter   : { var value : Nat },
) {

  // ── Public: submit a partnership / meeting request ───────────────────────
  // No authentication required — any visitor may submit.

  public shared func submitPartnershipRequest(
    input : PartnershipTypes.CreatePartnershipRequestInput,
  ) : async { #ok : PartnershipTypes.PartnershipRequest; #err : Text } {

    // ── Input validation ──────────────────────────────────────────────────
    if (input.name.size() == 0)          { return #err("Name is required") };
    if (input.name.size() > 100)         { return #err("Name must be 100 characters or fewer") };

    if (input.email.size() == 0)         { return #err("Email is required") };
    if (input.email.size() > 200)        { return #err("Email must be 200 characters or fewer") };
    if (not input.email.contains(#char '@')) { return #err("Email must contain '@'") };
    if (not input.email.contains(#char '.')) { return #err("Email must contain '.'") };

    if (input.company.size() == 0)       { return #err("Company is required") };
    if (input.company.size() > 200)      { return #err("Company must be 200 characters or fewer") };

    if (input.message.size() == 0)       { return #err("Message is required") };
    if (input.message.size() > 2000)     { return #err("Message must be 2000 characters or fewer") };

    if (input.preferredDate.size() == 0) { return #err("Preferred date is required") };
    if (input.preferredDate.size() > 50) { return #err("Preferred date must be 50 characters or fewer") };

    if (input.preferredTime.size() == 0) { return #err("Preferred time is required") };
    if (input.preferredTime.size() > 50) { return #err("Preferred time must be 50 characters or fewer") };

    // ── Persist ───────────────────────────────────────────────────────────
    partnershipCounter.value += 1;
    let id = "pr-" # partnershipCounter.value.toText();

    let request : PartnershipTypes.PartnershipRequest = {
      id;
      name          = input.name;
      email         = input.email;
      company       = input.company;
      message       = input.message;
      preferredDate = input.preferredDate;
      preferredTime = input.preferredTime;
      status        = "submitted";
      createdAt     = Time.now();
    };

    partnershipRequests.add(id, request);
    #ok(request);
  };

  // ── Admin: list all partnership requests, newest first ───────────────────

  public shared ({ caller }) func listPartnershipRequests()
    : async [PartnershipTypes.PartnershipRequest] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return [];  // silently return empty to avoid leaking request count
    };

    let all = List.empty<PartnershipTypes.PartnershipRequest>();
    partnershipRequests.forEach(func(_ : Text, req : PartnershipTypes.PartnershipRequest) {
      all.add(req);
    });

    // Sort newest first (descending createdAt)
    let sorted = all.sort(func(
      a : PartnershipTypes.PartnershipRequest,
      b : PartnershipTypes.PartnershipRequest,
    ) : Order.Order {
      if      (a.createdAt > b.createdAt) #less
      else if (a.createdAt < b.createdAt) #greater
      else                                #equal
    });
    sorted.toArray();
  };
};
