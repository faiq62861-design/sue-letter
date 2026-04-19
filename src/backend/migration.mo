/// Migration: add 6 optional credit-dispute fields to LetterFormData.
///
/// The old LetterFormData lacked:
///   creditBureauName, accountName, accountNumber,
///   inaccuracyType, creditDisputeDescription, creditSupportingDocs
///
/// All new fields are optional (?Text / ?[Text]), so every existing stored
/// letter gets them initialised to null.
import Map "mo:core/Map";

module {
  // ── Old types (copied from .old/src/backend/types/) ───────────────────────

  type OldAddress = {
    street : Text;
    city   : Text;
    state  : Text;
    zip    : Text;
  };

  type OldPriorContact = {
    attempted : Bool;
    count     : Nat;
    method    : Text;
  };

  type OldLetterType = {
    #DebtRecovery;
    #LandlordTenant;
    #RefundConsumer;
    #PropertyDamage;
    #CeaseDesist;
    #EmploymentDispute;
    #InsuranceClaim;
    #ContractorDispute;
    #CreditReportDispute;
  };

  type OldLetterTone = {
    #Firm;
    #Assertive;
    #FinalWarning;
  };

  type OldLetterStatus = {
    #Draft;
    #Sent;
    #ResponseReceived;
    #FollowUpNeeded;
    #Resolved;
  };

  type OldLetterFormData = {
    letterType          : OldLetterType;
    senderName          : Text;
    senderAddress       : OldAddress;
    senderPhone         : Text;
    senderEmail         : Text;
    recipientName       : Text;
    recipientAddress    : OldAddress;
    recipientRole       : Text;
    disputeDescription  : Text;
    incidentDate        : Text;
    amountDemanded      : ?Nat;
    currency            : Text;
    deadlineDays        : Nat;
    preferredResolution : Text;
    jurisdiction        : Text;
    tone                : OldLetterTone;
    evidenceItems       : [Text];
    evidenceImages      : [Text];
    priorContact        : OldPriorContact;
  };

  type OldGeneratedLetter = {
    id               : Text;
    userId           : Text;
    formData         : OldLetterFormData;
    letterContent    : Text;
    createdAt        : Int;
    status           : OldLetterStatus;
    isFollowUp       : Bool;
    originalLetterId : ?Text;
    downloadCount    : Nat;
    lastDownloadAt   : ?Int;
  };

  // ── New types (mirrors types/letters.mo + types/common.mo) ────────────────

  type NewAddress = OldAddress;
  type NewPriorContact = OldPriorContact;
  type NewLetterType = OldLetterType;
  type NewLetterTone = OldLetterTone;
  type NewLetterStatus = OldLetterStatus;

  type NewLetterFormData = {
    letterType               : NewLetterType;
    senderName               : Text;
    senderAddress            : NewAddress;
    senderPhone              : Text;
    senderEmail              : Text;
    recipientName            : Text;
    recipientAddress         : NewAddress;
    recipientRole            : Text;
    disputeDescription       : Text;
    incidentDate             : Text;
    amountDemanded           : ?Nat;
    currency                 : Text;
    deadlineDays             : Nat;
    preferredResolution      : Text;
    jurisdiction             : Text;
    tone                     : NewLetterTone;
    evidenceItems            : [Text];
    evidenceImages           : [Text];
    priorContact             : NewPriorContact;
    // New credit-dispute fields
    creditBureauName         : ?Text;
    accountName              : ?Text;
    accountNumber            : ?Text;
    inaccuracyType           : ?Text;
    creditDisputeDescription : ?Text;
    creditSupportingDocs     : ?[Text];
  };

  type NewGeneratedLetter = {
    id               : Text;
    userId           : Text;
    formData         : NewLetterFormData;
    letterContent    : Text;
    createdAt        : Int;
    status           : NewLetterStatus;
    isFollowUp       : Bool;
    originalLetterId : ?Text;
    downloadCount    : Nat;
    lastDownloadAt   : ?Int;
  };

  // ── Actor state shapes ─────────────────────────────────────────────────────

  type OldActor = {
    letters : Map.Map<Text, OldGeneratedLetter>;
  };

  type NewActor = {
    letters : Map.Map<Text, NewGeneratedLetter>;
  };

  // ── Migration function ─────────────────────────────────────────────────────

  func migrateFormData(old : OldLetterFormData) : NewLetterFormData {
    {
      old with
      creditBureauName         = null;
      accountName              = null;
      accountNumber            = null;
      inaccuracyType           = null;
      creditDisputeDescription = null;
      creditSupportingDocs     = null;
    };
  };

  func migrateLetter(old : OldGeneratedLetter) : NewGeneratedLetter {
    { old with formData = migrateFormData(old.formData) };
  };

  public func run(old : OldActor) : NewActor {
    let letters = old.letters.map<Text, OldGeneratedLetter, NewGeneratedLetter>(
      func(_id, letter) { migrateLetter(letter) }
    );
    { letters };
  };
};
