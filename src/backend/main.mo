import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";

import Common "types/common";
import LetterTypes "types/letters";
import UserTypes "types/users";
import GmailTypes "types/gmail";
import BlogTypes "types/blog";
import PartnershipTypes "types/partnership";
import Migration "migration";

import UsersMixin "mixins/users-api";
import LettersMixin "mixins/letters-api";
import AiMixin "mixins/ai-api";
import StripeMixin "mixins/stripe-api";
import AdminMixin "mixins/admin-api";
import GmailMixin "mixins/gmail-api";
import BlogMixin "mixins/blog-api";
import PartnershipMixin "mixins/partnership-api";



(with migration = Migration.run)
actor {
  // ── Authorization state ───────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── HTTP outcall transform (required for all HTTP outcalls) ───────────────
  public query func transform(
    input : OutCall.TransformationInput,
  ) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ── Shared state slices ───────────────────────────────────────────────────
  let userProfiles : Map.Map<Principal, UserTypes.UserProfile> = Map.empty();
  let letters      : Map.Map<Common.LetterId, LetterTypes.GeneratedLetter> = Map.empty();
  let letterCounter = { var value : Nat = 0 };
  let stripeConfig  = { var value : ?Stripe.StripeConfiguration = null };
  let gmailTokens  : Map.Map<Principal, GmailTypes.GmailToken> = Map.empty();

  // ── Audit log — persisted across upgrades via enhanced orthogonal persistence
  // Entries: (timestamp, callerPrincipal, action, outcome)
  let auditLog : List.List<(Common.Timestamp, Text, Text, Text)> = List.empty();

  // ── Blog article state ────────────────────────────────────────────────────
  let articles       : Map.Map<Text, BlogTypes.BlogArticle> = Map.empty();
  let articleCounter = { var value : Nat = 0 };

  // ── Partnership request state ─────────────────────────────────────────────
  let partnershipRequests : Map.Map<Text, PartnershipTypes.PartnershipRequest> = Map.empty();
  let partnershipCounter  = { var value : Nat = 0 };

  // ── Stripe (required by extension — declared directly in actor) ───────────

  /// Check whether Stripe has been configured.
  public query func isStripeConfigured() : async Bool {
    stripeConfig.value != null;
  };

  /// Store the Stripe secret key and allowed countries (admin only).
  public shared ({ caller }) func setStripeConfiguration(
    config : Stripe.StripeConfiguration,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig.value := ?config;
    // Log key TYPE only — never the key value
    let entry : (Common.Timestamp, Text, Text, Text) = (
      Time.now(),
      caller.toText(),
      "admin_key_updated",
      "stripe_configuration",
    );
    auditLog.add(entry);
  };

  /// Create a Stripe Checkout session for a pay-per-letter or plan upgrade.
  /// Returns Stripe session JSON (contains `url` to redirect the user).
  public shared ({ caller }) func createCheckoutSession(
    items      : [Stripe.ShoppingItem],
    successUrl : Text,
    cancelUrl  : Text,
  ) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let config = switch (stripeConfig.value) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?c)   { c };
    };
    await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);
  };

  /// Check payment status for a given Stripe session ID.
  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    let config = switch (stripeConfig.value) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?c)   { c };
    };
    await Stripe.getSessionStatus(config, sessionId, transform);
  };

  // ── Mixins ────────────────────────────────────────────────────────────────
  include UsersMixin(accessControlState, userProfiles);
  include LettersMixin(accessControlState, letters, userProfiles, letterCounter);
  include AiMixin(accessControlState, letters, userProfiles, func() { transform }, auditLog);
  include StripeMixin(accessControlState, userProfiles, stripeConfig, auditLog);
  include AdminMixin(accessControlState, userProfiles, letters, auditLog);
  include GmailMixin(accessControlState, gmailTokens, userProfiles, func() { transform });
  include BlogMixin(accessControlState, articles, articleCounter);
  include PartnershipMixin(accessControlState, partnershipRequests, partnershipCounter);
};
