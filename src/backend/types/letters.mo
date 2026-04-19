import Common "common";

module {
  // ── Enumerations ──────────────────────────────────────────────────────────

  public type LetterType = {
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

  public type LetterTone = {
    #Firm;
    #Assertive;
    #FinalWarning;
  };

  public type LetterStatus = {
    #Draft;
    #Sent;
    #ResponseReceived;
    #FollowUpNeeded;
    #Resolved;
  };

  public type ResponseLikelihood = {
    #Low;
    #Medium;
    #High;
  };

  // ── Address ───────────────────────────────────────────────────────────────

  public type Address = {
    street : Text;
    city   : Text;
    state  : Text; // two-letter state code, e.g. "CA"
    zip    : Text;
  };

  // ── Prior contact attempts ────────────────────────────────────────────────

  public type PriorContact = {
    attempted : Bool;
    count     : Nat;
    method    : Text; // e.g. "Phone", "Email", "Certified Mail"
  };

  // ── Form data submitted by the user ──────────────────────────────────────

  public type LetterFormData = {
    letterType           : LetterType;
    // Sender
    senderName           : Text;
    senderAddress        : Address;
    senderPhone          : Text;
    senderEmail          : Text;
    // Recipient
    recipientName        : Text;
    recipientAddress     : Address;
    recipientRole        : Text; // e.g. "Landlord", "Employer", "Contractor"
    // Dispute details
    disputeDescription   : Text;
    incidentDate         : Text; // ISO 8601 date string; Text for flexibility
    amountDemanded       : ?Nat; // in cents to avoid floats; null if N/A
    currency             : Text; // e.g. "USD"
    deadlineDays         : Nat;  // days from letter date to comply
    preferredResolution  : Text;
    jurisdiction         : Text; // two-letter US state code
    tone                 : LetterTone;
    evidenceItems        : [Text];
    evidenceImages       : [Text]; // object-storage image URLs attached as evidence
    priorContact         : PriorContact;
    // Credit Report Dispute — optional fields (null for all other letter types)
    creditBureauName         : ?Text; // e.g. "Equifax", "Experian", "TransUnion"
    accountName              : ?Text; // name of the account being disputed
    accountNumber            : ?Text; // last 4 digits or masked account number
    inaccuracyType           : ?Text; // e.g. "Late Payment", "Account Not Mine", "Incorrect Balance"
    creditDisputeDescription : ?Text; // what the correct information should be
    creditSupportingDocs     : ?[Text]; // list of supporting documents enclosed
  };

  // ── Generated letter record ───────────────────────────────────────────────

  public type GeneratedLetter = {
    id               : Common.LetterId;
    userId           : Common.UserId;
    formData         : LetterFormData;
    letterContent    : Text;
    createdAt        : Common.Timestamp;
    status           : LetterStatus;
    isFollowUp       : Bool;
    originalLetterId : ?Common.LetterId; // set when isFollowUp = true
    downloadCount    : Nat;              // number of times the letter was downloaded
    lastDownloadAt   : ?Int;             // Time.now() value of the last download, null if never downloaded
  };

  // ── Strength analysis ─────────────────────────────────────────────────────

  public type StrengthAnalysis = {
    score              : Nat; // 1-10
    strengths          : [Text];
    improvements       : [Text];
    responseLikelihood : ResponseLikelihood;
  };
};
