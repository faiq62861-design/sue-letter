import Types "../types/letters";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Char "mo:core/Char";

module {
  // ── Security helpers ───────────────────────────────────────────────────────

  /// Sanitise a user-supplied string before embedding it in a Claude prompt.
  /// (1) Removes/escapes characters that could break out of JSON strings.
  /// (2) Strips control characters (Unicode < U+0020 except tab/newline/CR).
  /// (3) Truncates to `maxLen`.
  public func sanitizeForPrompt(s : Text, maxLen : Nat) : Text {
    let chars = s.toArray();
    var result = "";
    var i = 0;
    while (i < chars.size() and result.size() < maxLen) {
      let c = chars[i];
      let code = c.toNat32();
      // Strip control characters below U+0020 except tab (0x09), newline (0x0A), CR (0x0D)
      if (code < 0x20 and code != 0x09 and code != 0x0A and code != 0x0D) {
        // skip — strip control character
      } else {
        // Escape characters that could break JSON strings or inject into prompts
        switch (c) {
          case '\\' { result #= "\\\\" };
          case '\u{22}' { result #= "\\\"" };   // double-quote
          case '<'  { result #= "&lt;" };
          case '>'  { result #= "&gt;" };
          case '`'  { result #= "&#96;" };
          case _    { result #= Text.fromChar(c) };
        };
      };
      i += 1;
    };
    result
  };

  /// Enhanced JSON string escaper used when building the HTTP body for Claude.
  /// Wraps the value in double-quotes and escapes all necessary characters.
  public func escapeJson(s : Text) : Text {
    let dq = Text.fromChar('\u{22}');
    let chars = s.toArray();
    var inner = "";
    for (c in chars.vals()) {
      switch (c) {
        case '\\' { inner #= "\\\\" };
        case '\u{22}' { inner #= "\\\"" };
        case '\n' { inner #= "\\n" };
        case '\r' { inner #= "\\r" };
        case '\t' { inner #= "\\t" };
        case '<'  { inner #= "\\u003C" };
        case '>'  { inner #= "\\u003E" };
        case '`'  { inner #= "\\u0060" };
        case _    {
          let code = c.toNat32();
          // Strip bare control characters
          if (code >= 0x20) {
            inner #= Text.fromChar(c);
          };
        };
      };
    };
    dq # inner # dq
  };

  // ── Input validation constants ─────────────────────────────────────────────
  public let MAX_NAME_LEN            : Nat = 500;
  public let MAX_EMAIL_LEN           : Nat = 254;
  public let MAX_DESCRIPTION_LEN     : Nat = 10_000;
  public let MAX_AMOUNT_DESC_LEN     : Nat = 1_000;
  public let MAX_DEADLINE_DAYS       : Nat = 3_650;
  public let MAX_SUBJECT_LEN         : Nat = 300;

  // ── Internal helpers ───────────────────────────────────────────────────────

  func letterTypeText(t : Types.LetterType) : Text {
    switch (t) {
      case (#DebtRecovery)        { "Debt Recovery" };
      case (#LandlordTenant)      { "Landlord/Tenant Dispute" };
      case (#RefundConsumer)      { "Refund & Consumer Complaint" };
      case (#PropertyDamage)      { "Property Damage Claim" };
      case (#CeaseDesist)         { "Cease and Desist" };
      case (#EmploymentDispute)   { "Employment Dispute" };
      case (#InsuranceClaim)      { "Insurance Claim Dispute" };
      case (#ContractorDispute)   { "Contractor/Service Dispute" };
      case (#CreditReportDispute) { "Credit Report Dispute" };
    };
  };

  func toneText(t : Types.LetterTone) : Text {
    switch (t) {
      case (#Firm)         { "firm and professional" };
      case (#Assertive)    { "assertive and direct" };
      case (#FinalWarning) { "final warning — extremely serious and urgent" };
    };
  };

  /// Returns country-specific laws for the given ISO country code and letter type.
  /// Covers 15 major jurisdictions plus a universal fallback.
  func getWorldLaws(country : Text, letterType : Types.LetterType) : Text {
    // Normalise to upper-case for matching
    let c = country.toUpper();
    switch (c) {
      // ── United States ──────────────────────────────────────────────────────
      case "US" {
        switch (letterType) {
          case (#DebtRecovery) {
            "Fair Debt Collection Practices Act (FDCPA) 15 U.S.C. § 1692 et seq.; " #
            "Uniform Commercial Code (UCC) § 3-118 (negotiable instruments); " #
            "Consumer Financial Protection Act 12 U.S.C. § 5481 et seq."
          };
          case (#LandlordTenant) {
            "Uniform Residential Landlord and Tenant Act (URLTA); " #
            "Fair Housing Act 42 U.S.C. § 3604; " #
            "Common law implied warranty of habitability"
          };
          case (#RefundConsumer) {
            "UCC § 2-314 (implied warranty of merchantability); " #
            "FTC Act § 5 (15 U.S.C. § 45) (unfair or deceptive acts); " #
            "Magnuson-Moss Warranty Act 15 U.S.C. § 2301 et seq."
          };
          case (#PropertyDamage) {
            "Restatement (Second) of Torts § 925 (harm to chattels); " #
            "Restatement (Third) of Torts: Physical and Emotional Harm § 1; " #
            "Common law negligence — duty, breach, causation, damages"
          };
          case (#CeaseDesist) {
            "Lanham Act 15 U.S.C. § 1125 (trademark/trade dress infringement); " #
            "17 U.S.C. § 106 (copyright exclusive rights); " #
            "Restatement (Second) of Torts § 652D (invasion of privacy)"
          };
          case (#EmploymentDispute) {
            "Fair Labor Standards Act (FLSA) 29 U.S.C. § 201 et seq.; " #
            "Title VII of the Civil Rights Act 42 U.S.C. § 2000e et seq.; " #
            "Americans with Disabilities Act (ADA) 42 U.S.C. § 12101 et seq.; " #
            "Age Discrimination in Employment Act (ADEA) 29 U.S.C. § 621 et seq."
          };
          case (#InsuranceClaim) {
            "Unfair Claims Settlement Practices Act (UCSPA) — state implementations; " #
            "Implied covenant of good faith and fair dealing (common law); " #
            "McCarran-Ferguson Act 15 U.S.C. § 1011 et seq."
          };
          case (#ContractorDispute) {
            "UCC § 2-601 (rejection of nonconforming goods/services); " #
            "Restatement (Second) of Contracts § 241 (material breach); " #
            "Common law quantum meruit (unjust enrichment)"
          };
          case (#CreditReportDispute) {
            "Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq.; " #
            "Consumer Financial Protection Bureau (CFPB) guidelines; " #
            "Fair and Accurate Credit Transactions Act (FACTA); " #
            "credit bureau dispute procedures under 15 U.S.C. § 1681i"
          };
        }
      };
      // ── United Kingdom ─────────────────────────────────────────────────────
      case "GB" {
        switch (letterType) {
          case (#DebtRecovery) {
            "Consumer Credit Act 1974 (ss. 77-79 credit agreements); " #
            "FCA Debt Collection Guidance CONC 7 (treating customers fairly); " #
            "Limitation Act 1980 s. 5 (6-year limitation on contract debts)"
          };
          case (#LandlordTenant) {
            "Housing Act 1988 ss. 8 & 21 (possession grounds and procedure); " #
            "Landlord and Tenant Act 1985 s. 11 (repairing obligations); " #
            "Tenancy Deposit Schemes Regulations 2007 (SI 2007/796)"
          };
          case (#RefundConsumer) {
            "Consumer Rights Act 2015 ss. 9-17 (goods must be satisfactory quality); " #
            "Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013; " #
            "Consumer Protection from Unfair Trading Regulations 2008"
          };
          case (#PropertyDamage) {
            "Tort (Interference with Goods) Act 1977; " #
            "Occupiers' Liability Act 1957; " #
            "Common law negligence (Donoghue v Stevenson [1932] AC 562)"
          };
          case (#CeaseDesist) {
            "Trade Marks Act 1994 s. 10 (infringement); " #
            "Copyright, Designs and Patents Act 1988 s. 16 (restricted acts); " #
            "Protection from Harassment Act 1997 s. 1"
          };
          case (#EmploymentDispute) {
            "Employment Rights Act 1996 (unfair dismissal, wrongful dismissal); " #
            "Equality Act 2010 ss. 13, 26 (direct discrimination, harassment); " #
            "National Minimum Wage Act 1998; Working Time Regulations 1998 (SI 1998/1833)"
          };
          case (#InsuranceClaim) {
            "Insurance Act 2015 ss. 8-10 (remedies for breach of warranty); " #
            "Consumer Insurance (Disclosure and Representations) Act 2012; " #
            "FCA Insurance Conduct of Business Sourcebook (ICOBS) 8"
          };
          case (#ContractorDispute) {
            "Supply of Goods and Services Act 1982 s. 13 (reasonable care and skill); " #
            "Consumer Rights Act 2015 s. 49 (services must be performed with care); " #
            "Housing Grants, Construction and Regeneration Act 1996 (payment provisions)"
          };
          case (#CreditReportDispute) {
            "Consumer Credit Act 1974; " #
            "Data Protection Act 2018; " #
            "UK GDPR Art. 16 (right to rectification); " #
            "Information Commissioner's Office (ICO) dispute procedures"
          };
        }
      };
      // ── Australia ──────────────────────────────────────────────────────────
      case "AU" {
        switch (letterType) {
          case (#DebtRecovery) {
            "Australian Consumer Law (ACL) Schedule 2 of the Competition and Consumer Act 2010 (Cth); " #
            "ASIC Act 2001 s. 12 (unconscionable conduct); " #
            "National Consumer Credit Protection Act 2009 (Cth)"
          };
          case (#LandlordTenant) {
            "Residential Tenancies Act (each state — e.g. Residential Tenancies Act 2010 NSW); " #
            "ACL Schedule 2 ss. 54-64 (consumer guarantees apply to residential supply); " #
            "Privacy Act 1988 (Cth) (handling tenant personal information)"
          };
          case (#RefundConsumer) {
            "ACL ss. 54-64 (consumer guarantees — satisfactory quality, fitness for purpose); " #
            "ACL s. 18 (misleading or deceptive conduct); " #
            "ACL s. 29 (false representations about goods and services)"
          };
          case (#PropertyDamage) {
            "Civil Liability Act 2002 (NSW) / Wrongs Act 1958 (VIC) (negligence framework); " #
            "ACL s. 18 (misleading conduct causing loss); " #
            "Common law negligence — reasonable foreseeability"
          };
          case (#CeaseDesist) {
            "Trade Marks Act 1995 (Cth) s. 120 (infringement); " #
            "Copyright Act 1968 (Cth) s. 36 (infringement of copyright); " #
            "ACL s. 18 (misleading or deceptive conduct — passing off)"
          };
          case (#EmploymentDispute) {
            "Fair Work Act 2009 (Cth) s. 385 (unfair dismissal); " #
            "Fair Work Act 2009 (Cth) ss. 340-344 (general protections — adverse action); " #
            "Age Discrimination Act 2004 (Cth); Racial Discrimination Act 1975 (Cth)"
          };
          case (#InsuranceClaim) {
            "Insurance Contracts Act 1984 (Cth) s. 54 (insurer cannot refuse claim for act of insured); " #
            "ASIC Act 2001 s. 12CB (unconscionable conduct in financial services); " #
            "General Insurance Code of Practice (ICA) 2020"
          };
          case (#ContractorDispute) {
            "ACL ss. 60-61 (services must be provided with due care and skill); " #
            "Building and Construction Industry Security of Payment Act 1999 (NSW); " #
            "Domestic Building Contracts Act 1995 (VIC) (applicable by state)"
          };
          case (#CreditReportDispute) {
            "Privacy Act 1988 (Cth); " #
            "Australian Privacy Principles (APP 13 — correction of personal information); " #
            "Credit Reporting Privacy Code; " #
            "Australian Financial Complaints Authority (AFCA) procedures"
          };
        }
      };
      // ── Canada ─────────────────────────────────────────────────────────────
      case "CA" {
        switch (letterType) {
          case (#DebtRecovery) {
            "Financial Consumer Agency of Canada Act S.C. 2001 c. 9; " #
            "Interest Act R.S.C. 1985 c. I-15; " #
            "Provincial consumer protection acts (e.g. Consumer Protection Act 2002 Ontario s. 17)"
          };
          case (#LandlordTenant) {
            "Residential Tenancies Act 2006 S.O. (Ontario) / applicable provincial RTA; " #
            "Canadian Charter of Rights and Freedoms s. 7 (security of person); " #
            "Human Rights Code R.S.O. 1990 c. H.19 (discrimination in accommodation)"
          };
          case (#RefundConsumer) {
            "Consumer Protection Act 2002 S.O. 2002 c. 30 Sch. A (Ontario); " #
            "Competition Act R.S.C. 1985 c. C-34 s. 74.01 (deceptive marketing); " #
            "Sale of Goods Act R.S.O. 1990 c. S.1 (implied conditions of quality)"
          };
          case (#PropertyDamage) {
            "Occupiers' Liability Act R.S.O. 1990 c. O.2; " #
            "Common law negligence (Anns/Cooper test — proximity and policy); " #
            "Limitations Act 2002 S.O. 2002 c. 24 (2-year basic limitation)"
          };
          case (#CeaseDesist) {
            "Trade-marks Act R.S.C. 1985 c. T-13 s. 20 (infringement); " #
            "Copyright Act R.S.C. 1985 c. C-42 s. 27 (infringement); " #
            "Criminal Code R.S.C. 1985 c. C-46 s. 264 (criminal harassment)"
          };
          case (#EmploymentDispute) {
            "Canada Labour Code R.S.C. 1985 c. L-2 (federal employees); " #
            "Canadian Human Rights Act R.S.C. 1985 c. H-6; " #
            "Employment Standards Act 2000 S.O. 2000 c. 41 (Ontario)"
          };
          case (#InsuranceClaim) {
            "Insurance Act R.S.O. 1990 c. I.8 (Ontario) s. 258 (statutory conditions); " #
            "Financial Services Regulatory Authority of Ontario (FSRA) Guidelines; " #
            "Common law duty of good faith (Whiten v Pilot Insurance [2002] 1 SCR 595)"
          };
          case (#ContractorDispute) {
            "Construction Act R.S.O. 1990 c. C.30 (lien and payment rights); " #
            "Sale of Goods Act R.S.O. 1990 s. 15 (implied warranty of fitness); " #
            "Common law breach of contract — expectation damages"
          };
          case (#CreditReportDispute) {
            "Personal Information Protection and Electronic Documents Act (PIPEDA); " #
            "Consumer Reporting Act (Ontario); " #
            "Credit Information Companies (Regulation) Act equivalent; " #
            "provincial consumer protection statutes"
          };
        }
      };
      // ── India ──────────────────────────────────────────────────────────────
      case "IN" {
        switch (letterType) {
          case (#DebtRecovery) {
            "Recovery of Debts and Bankruptcy Act 1993 (DRT jurisdiction); " #
            "Indian Contract Act 1872 ss. 73-74 (compensation for breach); " #
            "Code of Civil Procedure 1908 Order XXXVII (summary suit)"
          };
          case (#LandlordTenant) {
            "Transfer of Property Act 1882 ss. 105-117 (lease provisions); " #
            "Specific Relief Act 1963 s. 38 (perpetual injunction); " #
            "Model Tenancy Act 2021 (central model — adopted by states)"
          };
          case (#RefundConsumer) {
            "Consumer Protection Act 2019 ss. 34-35 (filing complaints with District Commission); " #
            "Consumer Protection Act 2019 s. 2(47) (unfair trade practices); " #
            "Indian Contract Act 1872 s. 64 (restoration of benefit on rescission)"
          };
          case (#PropertyDamage) {
            "Indian Contract Act 1872 s. 73 (compensation for loss caused by breach); " #
            "Specific Relief Act 1963 s. 6 (recovery of possession); " #
            "Code of Civil Procedure 1908 Order XXXIX (temporary injunction)"
          };
          case (#CeaseDesist) {
            "Trade Marks Act 1999 s. 29 (infringement); " #
            "Copyright Act 1957 s. 55 (civil remedies for infringement); " #
            "Information Technology Act 2000 s. 66C (identity theft)"
          };
          case (#EmploymentDispute) {
            "Industrial Disputes Act 1947 s. 25F (retrenchment compensation); " #
            "Payment of Wages Act 1936 (unlawful deductions); " #
            "Shops and Establishments Acts (state-specific — e.g. Maharashtra Shops Act 1948)"
          };
          case (#InsuranceClaim) {
            "Insurance Act 1938 s. 45 (prohibition on repudiation after 3 years); " #
            "Consumer Protection Act 2019 (insurance disputes before District/State Commission); " #
            "IRDAI (Protection of Policyholder Interests) Regulations 2017"
          };
          case (#ContractorDispute) {
            "Indian Contract Act 1872 s. 73 (unliquidated damages for breach); " #
            "Specific Relief Act 1963 s. 14 (specific performance where applicable); " #
            "Arbitration and Conciliation Act 1996 s. 8 (referral to arbitration)"
          };
          case (#CreditReportDispute) {
            "Credit Information Companies (Regulation) Act 2005; " #
            "RBI Master Direction on Credit Information Reporting; " #
            "Consumer Protection Act 2019"
          };
        }
      };
      // ── Germany ────────────────────────────────────────────────────────────
      case "DE" {
        switch (letterType) {
          case (#DebtRecovery) {
            "Bürgerliches Gesetzbuch (BGB) § 433 (Kaufvertrag — purchase contract obligations); " #
            "BGB § 286 (Schuldnerverzug — debtor in default); " #
            "Gesetz über das gerichtliche Mahnverfahren (ZPO §§ 688-703d — payment order proceedings)"
          };
          case (#LandlordTenant) {
            "BGB §§ 535-548 (Mietrecht — general tenancy law); " #
            "BGB § 558 (Mieterhöhung — rent increase limitations); " #
            "BGB § 543 (außerordentliche Kündigung — extraordinary termination)"
          };
          case (#RefundConsumer) {
            "BGB §§ 434-445 (Sachmängelhaftung — liability for defects); " #
            "Verbrauchsgüterkaufrichtlinie (EU Directive 2019/771 — consumer goods); " #
            "BGB § 355 (Widerrufsrecht — right of withdrawal within 14 days)"
          };
          case (#PropertyDamage) {
            "BGB § 823 (unerlaubte Handlung — tort/delict); " #
            "BGB § 249 (Naturalrestitution — restitution in kind); " #
            "Straßenverkehrsgesetz (StVG) § 7 (strict liability for motor vehicle damage)"
          };
          case (#CeaseDesist) {
            "Markengesetz (MarkenG) § 14 (Markenverletzung — trademark infringement); " #
            "Urheberrechtsgesetz (UrhG) § 97 (Anspruch auf Unterlassung und Schadensersatz); " #
            "Gesetz gegen unlauteren Wettbewerb (UWG) § 8 (Unterlassungsanspruch)"
          };
          case (#EmploymentDispute) {
            "Kündigungsschutzgesetz (KSchG) § 1 (soziale Rechtfertigung — social justification for dismissal); " #
            "Allgemeines Gleichbehandlungsgesetz (AGG) § 7 (discrimination prohibition); " #
            "Arbeitszeitgesetz (ArbZG) § 3 (maximum working hours)"
          };
          case (#InsuranceClaim) {
            "Versicherungsvertragsgesetz (VVG) § 14 (Fälligkeit der Versicherungsleistung — insurer's duty to pay); " #
            "VVG § 28 (Obliegenheitsverletzung — consequences of breach of duty); " #
            "Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin) Consumer Protection Guidelines"
          };
          case (#ContractorDispute) {
            "BGB §§ 631-650 (Werkvertragsrecht — contract for work and services); " #
            "BGB § 634 (Rechte des Bestellers bei Mängeln — client's rights on defects); " #
            "Vergabe- und Vertragsordnung für Bauleistungen (VOB/B) (standard construction terms)"
          };
          case (#CreditReportDispute) {
            "Bundesdatenschutzgesetz (BDSG); " #
            "EU GDPR Art. 16 (Berichtigung); " #
            "Schufa dispute procedures"
          };
        }
      };
      // ── France ─────────────────────────────────────────────────────────────
      case "FR" {
        switch (letterType) {
          case (#DebtRecovery) {
            "Code civil Art. 1231-1 (responsabilité contractuelle — dommages-intérêts); " #
            "Code de procédure civile Art. 1405 (injonction de payer — payment order); " #
            "Code civil Art. 2224 (prescription quinquennale — 5-year limitation)"
          };
          case (#LandlordTenant) {
            "Loi n° 89-462 du 6 juillet 1989 Art. 6 (obligations du bailleur); " #
            "Loi ALUR n° 2014-366 Art. 17 (encadrement des loyers — rent control); " #
            "Code civil Art. 1730 (état des lieux — inventory of fixtures)"
          };
          case (#RefundConsumer) {
            "Code de la consommation L. 217-4 (conformité du bien — conformity of goods); " #
            "Code de la consommation L. 121-1 (pratiques commerciales trompeuses); " #
            "Code civil Art. 1641 (garantie des vices cachés — hidden defects warranty)"
          };
          case (#PropertyDamage) {
            "Code civil Art. 1240 (responsabilité délictuelle — tort liability); " #
            "Code civil Art. 1242 (responsabilité du fait des choses — liability for things); " #
            "Loi Badinter n° 85-677 (accidents de la circulation — road traffic compensation)"
          };
          case (#CeaseDesist) {
            "Code de la propriété intellectuelle Art. L. 713-2 (contrefaçon de marque); " #
            "Code de la propriété intellectuelle Art. L. 335-2 (contrefaçon de droit d'auteur); " #
            "Code de commerce Art. L. 442-1 (pratiques restrictives de concurrence)"
          };
          case (#EmploymentDispute) {
            "Code du travail Art. L. 1237-19 (rupture conventionnelle — consensual termination); " #
            "Code du travail Art. L. 1132-1 (discrimination interdite — prohibited discrimination); " #
            "Code du travail Art. L. 3121-27 (durée légale du travail — 35-hour week)"
          };
          case (#InsuranceClaim) {
            "Code des assurances Art. L. 113-5 (obligation de l'assureur — insurer's obligation); " #
            "Code des assurances Art. L. 114-1 (prescription biennale — 2-year limitation); " #
            "Code de la consommation L. 141-1 (ADR for consumer insurance disputes)"
          };
          case (#ContractorDispute) {
            "Code civil Art. 1792 (responsabilité décennale — 10-year liability for construction); " #
            "Code civil Art. 1788 (perte de la chose — loss of work); " #
            "Loi Hoguet n° 70-9 (agents immobiliers — real estate/contractor agents)"
          };
          case (#CreditReportDispute) {
            "RGPD Art. 16 (droit de rectification); " #
            "Loi Informatique et Libertés; " #
            "CNIL dispute procedures"
          };
        }
      };
      // ── Japan ──────────────────────────────────────────────────────────────
      case "JP" {
        switch (letterType) {
          case (#DebtRecovery) {
            "Civil Code (民法) Art. 415 (債務不履行による損害賠償 — damages for non-performance); " #
            "Civil Code Art. 166 (消滅時効 — 5-year prescription period for claims); " #
            "Civil Execution Act (民事執行法) Art. 22 (enforcement)"
          };
          case (#LandlordTenant) {
            "Civil Code Art. 601 (賃貸借契約 — lease contract); " #
            "Act on Land and Building Leases (借地借家法) Art. 26 (renewal of building lease); " #
            "Civil Code Art. 621 (原状回復義務 — duty to restore premises)"
          };
          case (#RefundConsumer) {
            "Consumer Contract Act 2000 (消費者契約法) Art. 9 (unreasonable penalty clauses void); " #
            "Act against Unjustifiable Premiums and Misleading Representations (景品表示法); " #
            "Civil Code Art. 570 (担保責任 — warranty liability for defects)"
          };
          case (#PropertyDamage) {
            "Civil Code Art. 709 (不法行為 — general tort liability); " #
            "Civil Code Art. 717 (工作物責任 — liability for structures); " #
            "Civil Code Art. 722 (損害賠償 — scope of damages)"
          };
          case (#CeaseDesist) {
            "Trademark Act (商標法) Art. 36 (差止請求 — injunction claim); " #
            "Copyright Act (著作権法) Art. 112 (差止請求権 — right to demand cessation); " #
            "Unfair Competition Prevention Act (不正競争防止法) Art. 3 (injunction for unfair competition)"
          };
          case (#EmploymentDispute) {
            "Labour Standards Act 1947 (労働基準法) Art. 37 (割増賃金 — overtime pay); " #
            "Labour Contract Act 2007 (労働契約法) Art. 16 (解雇権濫用法理 — abusive dismissal is void); " #
            "Act on Securing, Etc. of Equal Opportunity and Treatment between Men and Women in Employment (男女雇用機会均等法)"
          };
          case (#InsuranceClaim) {
            "Insurance Act 2008 (保険法) Art. 17 (告知義務 — duty of disclosure); " #
            "Insurance Act Art. 59 (損害保険の保険給付 — benefit payment in non-life insurance); " #
            "Financial Services Agency (金融庁) Supervisory Guidelines on Insurance Business"
          };
          case (#ContractorDispute) {
            "Civil Code Art. 632 (請負契約 — contract for work); " #
            "Civil Code Art. 636 (請負人の担保責任 — contractor's warranty liability); " #
            "Housing Quality Assurance Act (住宅の品質確保の促進等に関する法律) Art. 94 (10-year warranty)"
          };
          case (#CreditReportDispute) {
            "Act on Protection of Personal Information (APPI); " #
            "Act on Use of Credit Information by Credit Bureaus; " #
            "FSA guidelines"
          };
        }
      };
      // ── South Africa ───────────────────────────────────────────────────────
      case "ZA" {
        switch (letterType) {
          case (#DebtRecovery) {
            "National Credit Act 34 of 2005 s. 129 (notice before debt enforcement); " #
            "Prescription Act 68 of 1969 s. 11 (3-year prescription for debts); " #
            "Magistrates' Courts Act 32 of 1944 (small claims / summary judgment)"
          };
          case (#LandlordTenant) {
            "Rental Housing Act 50 of 1999 s. 4 (written lease requirements); " #
            "Prevention of Illegal Eviction from and Unlawful Occupation of Land Act 19 of 1998 (PIE Act); " #
            "Consumer Protection Act 68 of 2008 s. 14 (fixed-term contracts)"
          };
          case (#RefundConsumer) {
            "Consumer Protection Act 68 of 2008 s. 56 (implied warranty on goods); " #
            "Consumer Protection Act s. 55 (consumer's right to safe goods); " #
            "Electronic Communications and Transactions Act 25 of 2002 s. 44 (online cooling-off)"
          };
          case (#PropertyDamage) {
            "Aquilian action (lex Aquilia) — common law delict for property damage; " #
            "Prescription Act 68 of 1969 s. 11(d) (3-year prescription for delictual claims); " #
            "Consumer Protection Act 68 of 2008 s. 61 (product liability)"
          };
          case (#CeaseDesist) {
            "Trade Marks Act 194 of 1993 s. 34 (infringement); " #
            "Copyright Act 98 of 1978 s. 23 (infringement); " #
            "Consumer Protection Act 68 of 2008 s. 29 (misleading representation)"
          };
          case (#EmploymentDispute) {
            "Labour Relations Act 66 of 1995 s. 185 (right not to be unfairly dismissed); " #
            "Basic Conditions of Employment Act 75 of 1997; " #
            "Employment Equity Act 55 of 1998 s. 6 (prohibition of unfair discrimination)"
          };
          case (#InsuranceClaim) {
            "Insurance Act 18 of 2017 (prudential requirements); " #
            "Policyholder Protection Rules (PPR) under the Short-term Insurance Act 53 of 1998; " #
            "Ombud for Short-term Insurance — Policyholder Protection Rules 2017"
          };
          case (#ContractorDispute) {
            "JBCC Principal Building Agreement (standard construction contract); " #
            "Consumer Protection Act 68 of 2008 s. 54 (right to quality service); " #
            "Construction Industry Development Board Act 38 of 2000"
          };
          case (#CreditReportDispute) {
            "National Credit Act 34 of 2005; " #
            "Protection of Personal Information Act (POPIA); " #
            "National Credit Regulator dispute procedures"
          };
        }
      };
      // ── Nigeria ────────────────────────────────────────────────────────────
      case "NG" {
        switch (letterType) {
          case (#DebtRecovery) {
            "Federal Competition and Consumer Protection Act 2018 s. 167 (debt recovery); " #
            "Limitation Act Cap L19 LFN 2004 (6-year limitation on simple contracts); " #
            "Sheriff and Civil Process Act Cap S6 LFN 2004 (enforcement of judgments)"
          };
          case (#LandlordTenant) {
            "Lagos State Tenancy Law 2011 s. 13 (notice to quit); " #
            "Recovery of Premises Act Cap R4 LFN 2004; " #
            "Rent Control and Recovery of Residential Premises Law (applicable state law)"
          };
          case (#RefundConsumer) {
            "Federal Competition and Consumer Protection Act 2018 ss. 114-116 (consumer rights); " #
            "Sale of Goods Act Cap S1 LFN 2004 s. 14 (implied conditions of quality); " #
            "Consumer Protection Council Act Cap C25 LFN 2004 s. 2 (right to redress)"
          };
          case (#PropertyDamage) {
            "Torts (general law) — Rylands v Fletcher rule (strict liability); " #
            "Limitation Act Cap L19 LFN 2004 s. 8 (6-year limitation for tort); " #
            "Nigerian law of negligence (Donoghue v Stevenson applied)"
          };
          case (#CeaseDesist) {
            "Trade Marks Act Cap T13 LFN 2004 s. 5 (infringement); " #
            "Copyright Act Cap C28 LFN 2004 s. 15 (infringement and remedies); " #
            "Federal Competition and Consumer Protection Act 2018 s. 123 (passing off)"
          };
          case (#EmploymentDispute) {
            "Labour Act Cap L1 LFN 2004 s. 9 (written particulars of employment); " #
            "Trade Disputes Act Cap T8 LFN 2004 (dispute resolution procedure); " #
            "National Industrial Court Act 2006 (jurisdiction over employment matters)"
          };
          case (#InsuranceClaim) {
            "Insurance Act 2003 s. 50 (settlement of claims); " #
            "National Insurance Commission (NAICOM) Market Conduct Guidelines 2018; " #
            "Consumer Protection Act — FCCPA 2018 (consumer redress in insurance)"
          };
          case (#ContractorDispute) {
            "Nigerian Law of Contract (based on English common law); " #
            "Public Procurement Act 2007 (government contracts); " #
            "Arbitration and Conciliation Act Cap A18 LFN 2004 (ADR for construction disputes)"
          };
          case (#CreditReportDispute) {
            "Nigeria Data Protection Regulation (NDPR) 2019; " #
            "Central Bank of Nigeria (CBN) Credit Reporting Regulations; " #
            "Federal Competition and Consumer Protection Act 2018 (consumer data rights)"
          };
        }
      };
      // ── Singapore ──────────────────────────────────────────────────────────
      case "SG" {
        switch (letterType) {
          case (#DebtRecovery) {
            "Consumer Protection (Fair Trading) Act (Cap. 52A) s. 6 (unfair practice claims); " #
            "Limitation Act (Cap. 163) s. 6 (6-year limitation for contract debts); " #
            "Small Claims Tribunals Act (Cap. 308) (claims up to SGD 30,000)"
          };
          case (#LandlordTenant) {
            "Residential Tenancies Act 2020 No. 19 (security deposit and tenancy terms); " #
            "Distress Act (Cap. 84) (landlord's right of distress for rent); " #
            "Housing and Development Act (Cap. 129) (HDB tenancy regulations)"
          };
          case (#RefundConsumer) {
            "Consumer Protection (Fair Trading) Act s. 6 (right to seek redress); " #
            "Sale of Goods Act (Cap. 393) s. 14 (implied condition of satisfactory quality); " #
            "Consumer Protection (Fair Trading) (Amendment) Act 2016 (lemon law provisions)"
          };
          case (#PropertyDamage) {
            "Tort of negligence — Spandeck Engineering (S) Pte Ltd v DSTA [2007] 4 SLR 100; " #
            "Limitation Act (Cap. 163) s. 24A (6-year limitation for property damage); " #
            "Civil Law Act (Cap. 43) s. 18 (loss of use of property)"
          };
          case (#CeaseDesist) {
            "Trade Marks Act (Cap. 332) s. 27 (infringement); " #
            "Copyright Act 2021 No. 22 s. 119 (civil remedies); " #
            "Tort of passing off — common law"
          };
          case (#EmploymentDispute) {
            "Employment Act (Cap. 91) s. 14 (dismissal without notice — misconduct); " #
            "Employment Claims Act 2016 (ECT jurisdiction for salary-related claims); " #
            "Workplace Fairness Act 2024 (anti-discrimination framework)"
          };
          case (#InsuranceClaim) {
            "Insurance Act (Cap. 142) s. 39 (claim payment obligations); " #
            "MAS Notice 124 (Guidelines on Fair Dealing); " #
            "Financial Industry Disputes Resolution Centre (FIDReC) rules"
          };
          case (#ContractorDispute) {
            "Building and Construction Industry Security of Payment Act (Cap. 30B) s. 5 (progress payments); " #
            "Supply of Goods Act (Cap. 394) s. 9 (implied terms in contracts for work and materials); " #
            "Contractors' All Risks Insurance — standard industry practice"
          };
          case (#CreditReportDispute) {
            "Personal Data Protection Act 2012 (PDPA); " #
            "Moneylenders Credit Bureau dispute procedures; " #
            "MAS guidelines"
          };
        }
      };
      // ── United Arab Emirates ───────────────────────────────────────────────
      case "AE" {
        switch (letterType) {
          case (#DebtRecovery) {
            "UAE Civil Code Federal Law No. 5 of 1985 Art. 272 (breach and termination); " #
            "Commercial Transactions Law Federal Law No. 18 of 1993 Art. 143 (commercial obligations); " #
            "Cheques and Promissory Notes — Federal Law No. 18 of 1993 Art. 617"
          };
          case (#LandlordTenant) {
            "Dubai Law No. 26 of 2007 (Tenancy Law) Art. 9 (permitted rent increases); " #
            "RERA Rental Index (Dubai) — Real Estate Regulatory Authority; " #
            "Abu Dhabi Law No. 20 of 2006 (tenancy in Abu Dhabi)"
          };
          case (#RefundConsumer) {
            "Federal Decree-Law No. 50 of 2022 (Consumer Protection Law) Art. 14 (right to refund); " #
            "Federal Decree-Law No. 50 of 2022 Art. 5 (consumer rights); " #
            "UAE Civil Code Art. 555 (implied warranty — defects in sale)"
          };
          case (#PropertyDamage) {
            "UAE Civil Code Federal Law No. 5 of 1985 Art. 282 (civil liability for harm); " #
            "UAE Civil Code Art. 316 (strict liability for things under custody); " #
            "Federal Decree-Law No. 31 of 2021 (Penal Code) Art. 438 (damage to property)"
          };
          case (#CeaseDesist) {
            "Federal Law No. 37 of 1992 on Trade Marks Art. 37 (infringement); " #
            "Federal Law No. 38 of 2021 on Intellectual Property Rights in Integrated Circuits; " #
            "Federal Decree-Law No. 38 of 2021 on Copyright and Neighbouring Rights Art. 38"
          };
          case (#EmploymentDispute) {
            "Federal Decree-Law No. 33 of 2021 (UAE Labour Law) Art. 47 (arbitrary dismissal compensation); " #
            "UAE Labour Law Art. 51 (end of service gratuity); " #
            "MOHRE (Ministry of Human Resources and Emiratisation) Ministerial Decree No. 47 of 2022"
          };
          case (#InsuranceClaim) {
            "Federal Law No. 6 of 2007 (Establishing the Insurance Authority) Art. 26; " #
            "UAE Insurance Authority Board Decision No. 25 of 2016 (Motor Vehicle Insurance); " #
            "Central Bank of UAE Consumer Protection Regulation 2020"
          };
          case (#ContractorDispute) {
            "UAE Civil Code Art. 880 (Muqawala — contract for work, defect liability 10 years); " #
            "UAE Civil Code Art. 892 (contractor's liability for structural defects); " #
            "Federal Law No. 6 of 2018 (Arbitration Law) for construction disputes"
          };
          case (#CreditReportDispute) {
            "Federal Law No. 2 of 2019 on the Use of Information and Communication Technology in Health; " #
            "UAE Credit Bureau (AECB) dispute procedures; " #
            "Central Bank UAE guidelines"
          };
        }
      };
      // ── Brazil ─────────────────────────────────────────────────────────────
      case "BR" {
        switch (letterType) {
          case (#DebtRecovery) {
            "Código Civil Lei 10.406/2002 Art. 395 (mora do devedor — debtor's default); " #
            "Lei 9.492/1997 (protesto de títulos — protest of negotiable instruments); " #
            "Código de Processo Civil Art. 783 (execução de título extrajudicial)"
          };
          case (#LandlordTenant) {
            "Lei do Inquilinato Lei 8.245/1991 Art. 23 (obrigações do locatário); " #
            "Lei 8.245/1991 Art. 62 (ação de despejo — eviction procedure); " #
            "Lei 8.245/1991 Art. 37 (garantias locatícias — tenancy guarantees)"
          };
          case (#RefundConsumer) {
            "Código de Defesa do Consumidor (CDC) Lei 8.078/1990 Art. 18 (vícios do produto — product defects); " #
            "CDC Art. 49 (direito de arrependimento — 7-day cooling-off right); " #
            "CDC Art. 6(VI) (prevenção e reparação de danos — prevention and compensation)"
          };
          case (#PropertyDamage) {
            "Código Civil Lei 10.406/2002 Art. 186 (ato ilícito — unlawful act); " #
            "Código Civil Art. 927 (obrigação de reparar o dano — obligation to repair damage); " #
            "Código Civil Art. 1.228 (direito de propriedade — property rights)"
          };
          case (#CeaseDesist) {
            "Lei de Propriedade Industrial Lei 9.279/1996 Art. 129 (violação de marca); " #
            "Lei de Direitos Autorais Lei 9.610/1998 Art. 102 (infração); " #
            "CDC Art. 67 (publicidade enganosa — misleading advertising)"
          };
          case (#EmploymentDispute) {
            "Consolidação das Leis do Trabalho (CLT) Decreto-Lei 5.452/1943 Art. 482 (justa causa); " #
            "CLT Art. 477 (rescisão contratual — termination formalities); " #
            "Constituição Federal 1988 Art. 7° (direitos dos trabalhadores — workers' rights)"
          };
          case (#InsuranceClaim) {
            "Código Civil Art. 757 (contrato de seguro — insurance contract obligations); " #
            "SUSEP Circular No. 621/2021 (claim settlement procedures); " #
            "CDC Art. 51 (cláusulas abusivas — abusive clauses in insurance contracts)"
          };
          case (#ContractorDispute) {
            "Código Civil Art. 610 (contrato de empreitada — work contract); " #
            "Código Civil Art. 618 (garantia da obra — 5-year warranty on construction); " #
            "Lei 8.666/1993 (licitações e contratos administrativos — public contracts)"
          };
          case (#CreditReportDispute) {
            "Lei Geral de Proteção de Dados (LGPD); " #
            "Cadastro Positivo Lei 12.414/2011; " #
            "CDC Art. 43 (consumer data rights)"
          };
        }
      };
      // ── Mexico ─────────────────────────────────────────────────────────────
      case "MX" {
        switch (letterType) {
          case (#DebtRecovery) {
            "Código Civil Federal Art. 2104 (incumplimiento de obligaciones — non-performance); " #
            "Código de Comercio Art. 1391 (títulos ejecutivos — enforceable instruments); " #
            "Ley Federal de Protección al Consumidor Art. 92 (PROFECO conciliation)"
          };
          case (#LandlordTenant) {
            "Ley de Arrendamiento Inmobiliario (CDMX) Art. 22 (obligaciones del arrendador); " #
            "Código Civil Federal Art. 2425 (contrato de arrendamiento); " #
            "Ley de Arrendamiento Inmobiliario Art. 82 (desahucio — eviction procedure)"
          };
          case (#RefundConsumer) {
            "Ley Federal de Protección al Consumidor (LFPC) Art. 92 (derecho de devolución); " #
            "LFPC Art. 1 (principios de protección — consumer protection principles); " #
            "Norma Oficial Mexicana NOM-024-SCFI-1998 (información comercial)"
          };
          case (#PropertyDamage) {
            "Código Civil Federal Art. 1910 (responsabilidad civil extracontractual — tort); " #
            "Código Civil Federal Art. 1915 (reparación del daño — measure of damages); " #
            "Ley Federal de Responsabilidad Patrimonial del Estado Art. 14 (government liability)"
          };
          case (#CeaseDesist) {
            "Ley de la Propiedad Industrial Art. 213 (infracciones administrativas — trademark); " #
            "Ley Federal del Derecho de Autor Art. 231 (infracción en materia de derechos de autor); " #
            "Ley Federal de Competencia Económica Art. 53 (prácticas monopólicas)"
          };
          case (#EmploymentDispute) {
            "Ley Federal del Trabajo Art. 48 (reinstalación o indemnización — reinstatement or compensation); " #
            "LFT Art. 76 (derecho a vacaciones — right to vacation); " #
            "LFT Art. 123 Constitucional (derechos laborales fundamentales)"
          };
          case (#InsuranceClaim) {
            "Ley sobre el Contrato de Seguro Art. 36 (obligación de pago — payment obligation); " #
            "Ley de Instituciones de Seguros y de Fianzas Art. 303; " #
            "CONDUSEF (Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros) — dispute resolution"
          };
          case (#ContractorDispute) {
            "Código Civil Federal Art. 2616 (contrato de obra — work contract terms); " #
            "Código Civil Federal Art. 2637 (vicios de construcción — construction defects); " #
            "Ley de Obras Públicas y Servicios Relacionados con las Mismas Art. 64 (public works)"
          };
          case (#CreditReportDispute) {
            "Ley Federal de Protección de Datos Personales; " #
            "Ley para Regular las Sociedades de Información Crediticia; " #
            "CONDUSEF dispute procedures"
          };
        }
      };
      // ── New Zealand ────────────────────────────────────────────────────────
      case "NZ" {
        switch (letterType) {
          case (#DebtRecovery) {
            "Credit Contracts and Consumer Finance Act 2003 s. 89 (oppressive credit contracts); " #
            "Limitation Act 2010 s. 11 (6-year limitation for debt claims); " #
            "Disputes Tribunal Act 1988 (claims up to NZD 30,000)"
          };
          case (#LandlordTenant) {
            "Residential Tenancies Act 1986 s. 45 (landlord's obligations); " #
            "Residential Tenancies Act 1986 s. 55 (termination for non-payment of rent); " #
            "Residential Tenancies Act 1986 s. 16A (bond lodgement requirements)"
          };
          case (#RefundConsumer) {
            "Consumer Guarantees Act 1993 s. 6 (guarantee of acceptable quality); " #
            "Consumer Guarantees Act 1993 s. 32 (services must be completed with due care); " #
            "Fair Trading Act 1986 s. 9 (misleading and deceptive conduct)"
          };
          case (#PropertyDamage) {
            "Tort of negligence — common law (Hamlin principle applied for property); " #
            "Limitation Act 2010 s. 11 (6-year limitation for property damage); " #
            "Building Act 2004 s. 362D (defective building work)"
          };
          case (#CeaseDesist) {
            "Trade Marks Act 2002 s. 89 (infringement); " #
            "Copyright Act 1994 s. 120 (injunction as civil remedy); " #
            "Fair Trading Act 1986 s. 9 (passing off through misleading conduct)"
          };
          case (#EmploymentDispute) {
            "Employment Relations Act 2000 s. 103A (unjustified dismissal — test); " #
            "Employment Relations Act 2000 s. 104 (unjustified disadvantage); " #
            "Human Rights Act 1993 s. 22 (discrimination in employment)"
          };
          case (#InsuranceClaim) {
            "Insurance Law Reform Act 1977 s. 11 (insurer cannot decline on grounds of non-disclosure unless material); " #
            "Fair Trading Act 1986 s. 9 (insurer's misleading conduct); " #
            "Insurance and Financial Services Ombudsman Scheme (IFSO) Rules"
          };
          case (#ContractorDispute) {
            "Consumer Guarantees Act 1993 s. 28 (implied guarantee of reasonable care and skill); " #
            "Construction Contracts Act 2002 s. 23 (payment claims); " #
            "Building Act 2004 s. 14B (duty of building work to comply with building code)"
          };
          case (#CreditReportDispute) {
            "Privacy Act 2020; " #
            "Credit Reporting Privacy Code 2004; " #
            "Financial Dispute Resolution scheme"
          };
        }
      };
      // ── Universal fallback ─────────────────────────────────────────────────
      case _ {
        switch (letterType) {
          case (#DebtRecovery) {
            "UN Convention on Contracts for the International Sale of Goods (CISG) Art. 74 (damages for breach); " #
            "UNCITRAL Model Law on International Commercial Arbitration 1985 (as amended 2006); " #
            "ILO Convention No. 173 (protection of workers' claims in insolvency — where applicable); " #
            "Note: Consult a qualified local attorney for country-specific statutes and procedural requirements."
          };
          case (#LandlordTenant) {
            "UN Covenant on Economic, Social and Cultural Rights Art. 11 (adequate housing); " #
            "UNCITRAL Model Tenancy Law (2021 — where adopted); " #
            "Local residential tenancy legislation — consult qualified local counsel; " #
            "Note: Consult a qualified local attorney for country-specific statutes and procedural requirements."
          };
          case (#RefundConsumer) {
            "UN Guidelines for Consumer Protection (UNGCP) 2015 — Principle VI (redress); " #
            "CISG Art. 46 (buyer's right to require performance); " #
            "UNCITRAL Model Law on Electronic Commerce Art. 11 (online contracts); " #
            "Note: Consult a qualified local attorney for country-specific statutes and procedural requirements."
          };
          case (#PropertyDamage) {
            "UNIDROIT Principles of International Commercial Contracts Art. 7.4.2 (full compensation); " #
            "General principles of tort/delict — duty, breach, causation, damage; " #
            "Local limitation periods apply — consult local counsel; " #
            "Note: Consult a qualified local attorney for country-specific statutes and procedural requirements."
          };
          case (#CeaseDesist) {
            "TRIPS Agreement (WTO) Art. 41 (enforcement of IP rights); " #
            "WIPO Copyright Treaty 1996 Art. 12 (obligations concerning rights management information); " #
            "Paris Convention for the Protection of Industrial Property Art. 10bis (unfair competition); " #
            "Note: Consult a qualified local attorney for country-specific statutes and procedural requirements."
          };
          case (#EmploymentDispute) {
            "ILO Convention No. 158 (Termination of Employment Convention 1982) Art. 4; " #
            "ILO Convention No. 100 (Equal Remuneration Convention 1951); " #
            "ILO Convention No. 111 (Discrimination (Employment and Occupation) Convention 1958); " #
            "Note: Consult a qualified local attorney for country-specific statutes and procedural requirements."
          };
          case (#InsuranceClaim) {
            "IAIS Insurance Core Principles (ICP 19 — Conduct of Business); " #
            "UNCITRAL Model Law on International Commercial Arbitration (for dispute resolution); " #
            "General principle of utmost good faith (uberrimae fidei) in insurance contracts; " #
            "Note: Consult a qualified local attorney for country-specific statutes and procedural requirements."
          };
          case (#ContractorDispute) {
            "CISG Art. 35 (conformity of goods and services); " #
            "UNIDROIT Principles Art. 7.1.1 (non-performance); " #
            "UNCITRAL Legal Guide on Construction of Industrial Works; " #
            "Note: Consult a qualified local attorney for country-specific statutes and procedural requirements."
          };
          case (#CreditReportDispute) {
            "OECD Guidelines on the Protection of Privacy and Transborder Flows of Personal Data; " #
            "UN Guidelines for the Regulation of Computerised Personal Data Files (1990); " #
            "Local credit reporting and data protection legislation — consult qualified local counsel; " #
            "Note: Consult a qualified local attorney for country-specific statutes and procedural requirements."
          };
        }
      };
    }
  };

  func statutesForType(letterType : Types.LetterType, state : Text) : Text {
    switch (letterType) {
      case (#DebtRecovery) {
        "Fair Debt Collection Practices Act (FDCPA) 15 U.S.C. § 1692 et seq.; " #
        state # " statute of limitations for contract claims; " #
        "Uniform Commercial Code (UCC) § 3-118 (negotiable instruments)"
      };
      case (#LandlordTenant) {
        if (state == "CA") {
          "California Civil Code § 1950.5 (security deposits); " #
          "California Civil Code § 1941 (habitability); " #
          "California Code of Civil Procedure § 1161 (unlawful detainer)"
        } else if (state == "NY") {
          "New York Real Property Law § 235-b (warranty of habitability); " #
          "New York Real Property Law § 226-b (subletting rights)"
        } else if (state == "TX") {
          "Texas Property Code § 92.001 et seq. (residential tenancies); " #
          "Texas Property Code § 92.103 (security deposit return)"
        } else if (state == "FL") {
          "Florida Statutes § 83.49 (security deposit); " #
          "Florida Statutes § 83.51 (landlord obligations)"
        } else {
          state # " Residential Landlord-Tenant Act; " #
          "UCC Article 2 (implied warranty); " #
          "Common law duty of habitability"
        }
      };
      case (#RefundConsumer) {
        "UCC § 2-314 (implied warranty of merchantability); " #
        "UCC § 2-601 (buyer's rights on improper delivery); " #
        "FTC Act § 5 (15 U.S.C. § 45) (unfair or deceptive acts); " #
        state # " Consumer Protection Act"
      };
      case (#PropertyDamage) {
        "Restatement (Second) of Torts § 925 (property damage); " #
        state # " negligence statute; " #
        state # " statute of limitations for property damage claims"
      };
      case (#CeaseDesist) {
        "Lanham Act 15 U.S.C. § 1125 (trademark/trade dress); " #
        "17 U.S.C. § 106 (copyright); " #
        state # " harassment and stalking statutes; " #
        "Restatement (Second) of Torts § 652D (invasion of privacy)"
      };
      case (#EmploymentDispute) {
        "Fair Labor Standards Act (FLSA) 29 U.S.C. § 201 et seq.; " #
        "Title VII of the Civil Rights Act 42 U.S.C. § 2000e et seq.; " #
        "Americans with Disabilities Act 42 U.S.C. § 12101 et seq.; " #
        "Age Discrimination in Employment Act 29 U.S.C. § 621 et seq.; " #
        state # " Labor Code"
      };
      case (#InsuranceClaim) {
        state # " bad faith insurance statute; " #
        "Unfair Claims Settlement Practices Act; " #
        "Insurance contract implied covenant of good faith and fair dealing"
      };
      case (#ContractorDispute) {
        "UCC § 2-601 (rejection of nonconforming goods/services); " #
        "Restatement (Second) of Contracts § 241 (material breach); " #
        state # " contractor licensing statutes; " #
        state # " construction defect statute of limitations"
      };
      case (#CreditReportDispute) {
        "Fair Credit Reporting Act (FCRA) 15 U.S.C. § 1681 et seq.; " #
        "Fair and Accurate Credit Transactions Act (FACTA) 15 U.S.C. § 1681i (dispute procedures); " #
        "Consumer Financial Protection Bureau (CFPB) credit reporting guidelines; " #
        state # " consumer protection statutes relating to credit reporting"
      };
    };
  };

  func formatAddress(a : Types.Address) : Text {
    a.street # ", " # a.city # ", " # a.state # " " # a.zip
  };

  func formatAmount(amount : ?Nat, currency : Text) : Text {
    switch (amount) {
      case (null) { "an amount to be determined" };
      case (?cents) {
        let dollars = cents / 100;
        let remainingCents = cents % 100;
        let centsStr = if (remainingCents < 10) "0" # remainingCents.toText() else remainingCents.toText();
        currency # " " # dollars.toText() # "." # centsStr
      };
    };
  };

  func formatPriorContact(pc : Types.PriorContact) : Text {
    if (not pc.attempted) {
      "No prior contact has been attempted."
    } else {
      "Prior contact: " # pc.count.toText() # " attempt(s) via " # pc.method # "."
    };
  };

  func formatEvidence(items : [Text]) : Text {
    if (items.size() == 0) {
      "No supporting evidence specified."
    } else {
      let lines = items.map(func(item : Text) : Text { "- " # item });
      lines.values().join("\n");
    };
  };

  // ── Prompt builders ───────────────────────────────────────────────────────

  // ── Credit Report Dispute prompt helpers ──────────────────────────────────

  func optText(t : ?Text, fallback : Text) : Text {
    switch (t) { case (?v) { v }; case null { fallback } };
  };

  func formatCreditDocs(docs : ?[Text]) : Text {
    let arr = switch (docs) { case (?d) { d }; case null { [] } };
    if (arr.size() == 0) {
      "No supporting documents specified."
    } else {
      let lines = arr.map(func(d : Text) : Text { "- " # d });
      lines.values().join("\n");
    };
  };

  /// Build a law-free, professional credit bureau dispute letter prompt.
  func buildCreditDisputePrompt(formData : Types.LetterFormData) : Text {
    // Sanitise all user-provided fields
    let sSenderName      = sanitizeForPrompt(formData.senderName, MAX_NAME_LEN);
    let sSenderEmail     = sanitizeForPrompt(formData.senderEmail, MAX_EMAIL_LEN);
    let sSenderPhone     = sanitizeForPrompt(formData.senderPhone, MAX_NAME_LEN);
    let sBureauName      = sanitizeForPrompt(optText(formData.creditBureauName, formData.recipientName), MAX_NAME_LEN);
    let sAccountName     = sanitizeForPrompt(optText(formData.accountName, "the account in question"), MAX_NAME_LEN);
    let sAccountNumber   = sanitizeForPrompt(optText(formData.accountNumber, ""), MAX_NAME_LEN);
    let sInaccuracyType  = sanitizeForPrompt(optText(formData.inaccuracyType, "inaccurate information"), MAX_NAME_LEN);
    let sDisputeDesc     = sanitizeForPrompt(optText(formData.creditDisputeDescription, formData.disputeDescription), MAX_DESCRIPTION_LEN);
    let sDocsStr         = formatCreditDocs(formData.creditSupportingDocs);

    let accountRef = if (sAccountNumber == "") {
      "Account Name: " # sAccountName
    } else {
      "Account Name: " # sAccountName # "\nAccount Number: " # sAccountNumber
    };

    "You are drafting a professional credit report dispute letter on behalf of a consumer. " #
    "Write a clean, formal dispute letter addressed to a credit reporting bureau. " #
    "IMPORTANT RESTRICTIONS — you MUST follow these exactly:\n" #
    "- Do NOT cite any laws, acts, statutes, regulations, or legal codes anywhere in the letter.\n" #
    "- Do NOT include a Legal Basis section.\n" #
    "- Do NOT include any litigation threats or consequences for non-compliance.\n" #
    "- Do NOT mention FCRA, FACTA, CFPB, GDPR, Data Protection Act, or any other legislation.\n" #
    "- Write a clean, professional dispute letter only — no legal language beyond standard formal correspondence.\n\n" #

    "SENDER INFORMATION:\n" #
    "Name: " # sSenderName # "\n" #
    "Address: " # formatAddress(formData.senderAddress) # "\n" #
    "Phone: " # sSenderPhone # "\n" #
    "Email: " # sSenderEmail # "\n\n" #

    "CREDIT BUREAU:\n" #
    "Name: " # sBureauName # "\n" #
    "Address: " # formatAddress(formData.recipientAddress) # "\n\n" #

    "DISPUTED ACCOUNT DETAILS:\n" #
    accountRef # "\n" #
    "Nature of Inaccuracy: " # sInaccuracyType # "\n" #
    "Correct Information / What Should Be Shown: " # sDisputeDesc # "\n\n" #

    "SUPPORTING DOCUMENTS ENCLOSED:\n" # sDocsStr # "\n\n" #

    "REQUIRED LETTER STRUCTURE (use exactly these sections in order):\n" #
    "1. SENDER HEADER — sender's full name and address (top left)\n" #
    "2. DATE — today's full date\n" #
    "3. BUREAU ADDRESS — credit bureau name and address\n" #
    "4. RE: LINE — 'Re: Dispute of Inaccurate Information — " # sAccountName # (if (sAccountNumber == "") "" else (", Account #" # sAccountNumber)) # "'\n" #
    "5. OPENING PARAGRAPH — formally state that the sender is writing to dispute an inaccuracy on their credit report, identify the account by name" # (if (sAccountNumber == "") "" else " and account number") # "\n" #
    "6. DETAILS PARAGRAPH — clearly describe the nature of the inaccuracy (" # sInaccuracyType # ") and what the correct information should be\n" #
    "7. SUPPORTING DOCUMENTS PARAGRAPH — list the enclosed supporting documents\n" #
    "8. REQUEST PARAGRAPH — politely but firmly request that the bureau investigate the disputed item and correct or remove the inaccuracy from the credit report\n" #
    "9. CLOSING — professional sign-off requesting written confirmation of the investigation and outcome within a reasonable timeframe; end with 'Sincerely,' followed by sender's full name\n\n" #

    "FORMAT REQUIREMENTS:\n" #
    "- Use formal, polite, professional business letter tone throughout\n" #
    "- NO placeholder brackets like [NAME] or [DATE] — use all the actual data provided above\n" #
    "- No legal jargon, no statute citations, no law names\n" #
    "- Write today's date in full (e.g., 'April 19, 2026')\n\n" #

    "Write the complete credit report dispute letter now:";
  };

  /// Build the combined prompt for letter generation.
  /// All user-supplied fields are sanitised with sanitizeForPrompt() before insertion.
  /// country: optional ISO country code (e.g. "US", "GB"); passed separately from formData
  /// since country is NOT stored in LetterFormData to maintain stable compatibility.
  public func buildLetterPrompt(formData : Types.LetterFormData, country : ?Text) : Text {
    // Credit Report Dispute uses a completely separate, law-free prompt
    switch (formData.letterType) {
      case (#CreditReportDispute) {
        buildCreditDisputePrompt(formData);
      };
      case _ {
        let statutes = statutesForType(formData.letterType, formData.jurisdiction);
        let countryCode = switch (country) { case (?c) { if (c == "") "US" else c }; case null { "US" } };
        let worldLaws = getWorldLaws(countryCode, formData.letterType);
        let amountStr = formatAmount(formData.amountDemanded, formData.currency);
        let evidenceStr = formatEvidence(formData.evidenceItems);
        let priorContactStr = formatPriorContact(formData.priorContact);
        let toneStr = toneText(formData.tone);
        let typeStr = letterTypeText(formData.letterType);

        // Sanitise all user-provided Text fields before embedding in prompt
        let sSenderName        = sanitizeForPrompt(formData.senderName, MAX_NAME_LEN);
        let sRecipientName     = sanitizeForPrompt(formData.recipientName, MAX_NAME_LEN);
        let sSenderEmail       = sanitizeForPrompt(formData.senderEmail, MAX_EMAIL_LEN);
        let sSenderPhone       = sanitizeForPrompt(formData.senderPhone, MAX_NAME_LEN);
        let sRecipientRole     = sanitizeForPrompt(formData.recipientRole, MAX_NAME_LEN);
        let sDisputeDesc       = sanitizeForPrompt(formData.disputeDescription, MAX_DESCRIPTION_LEN);
        let sResolution        = sanitizeForPrompt(formData.preferredResolution, MAX_DESCRIPTION_LEN);
        let sIncidentDate      = sanitizeForPrompt(formData.incidentDate, MAX_NAME_LEN);

        "You are an expert attorney drafting a professional demand letter. " #
        "Write a complete, formal demand letter with NO placeholder brackets whatsoever. " #
        "Insert all provided data verbatim. The tone must be " # toneStr # ".\n\n" #

        "LETTER TYPE: " # typeStr # "\n" #
        "JURISDICTION: " # formData.jurisdiction # "\n" #
        "COUNTRY: " # countryCode # "\n\n" #

        "SENDER INFORMATION:\n" #
        "Name: " # sSenderName # "\n" #
        "Address: " # formatAddress(formData.senderAddress) # "\n" #
        "Phone: " # sSenderPhone # "\n" #
        "Email: " # sSenderEmail # "\n\n" #

        "RECIPIENT INFORMATION:\n" #
        "Name: " # sRecipientName # "\n" #
        "Address: " # formatAddress(formData.recipientAddress) # "\n" #
        "Role: " # sRecipientRole # "\n\n" #

        "DISPUTE DETAILS:\n" #
        "Incident Date: " # sIncidentDate # "\n" #
        "Amount Demanded: " # amountStr # "\n" #
        "Deadline: " # formData.deadlineDays.toText() # " days from the date of this letter\n" #
        "Preferred Resolution: " # sResolution # "\n" #
        "Description: " # sDisputeDesc # "\n\n" #

        "EVIDENCE:\n" # evidenceStr # "\n\n" #

        "PRIOR CONTACT: " # priorContactStr # "\n\n" #

        "APPLICABLE LAWS AND STATUTES:\n" # worldLaws # "\n\n" #

        "IMPORTANT: You MUST cite the following country-specific laws verbatim in the Legal Basis section " #
        "with exact statute/section references: " # worldLaws # ". " #
        "Do not use placeholder brackets. Use the exact statute names and section numbers provided. " #
        "Cite at least 2-3 of these laws with their exact section/article numbers.\n\n" #

        "SUPPLEMENTARY US STATUTES (cite if jurisdiction is US/state-level):\n" # statutes # "\n\n" #

        "REQUIRED LETTER STRUCTURE (7 paragraphs):\n" #
        "1. OPENING DEMAND — State the demand clearly and the amount owed\n" #
        "2. FACTS — Detailed factual background of the dispute\n" #
        "3. LEGAL BASIS — Cite each applicable statute listed above by full name and code section. " #
        "   Cite at least 2-3 country-specific laws verbatim with exact article/section numbers.\n" #
        "4. EVIDENCE — Reference each evidence item provided\n" #
        "5. SPECIFIC DEMAND — Exact remedy required, exact deadline date (calculate from today plus " # formData.deadlineDays.toText() # " days)\n" #
        "6. CONSEQUENCES — Consequences of non-compliance (legal action, court costs, attorney fees)\n" #
        "7. CLOSING — Professional closing with sender's full name and contact information\n\n" #

        "FORMAT REQUIREMENTS:\n" #
        "- Begin with sender's letterhead (name, address, phone, email)\n" #
        "- Include today's date\n" #
        "- Include RE: subject line identifying the dispute type\n" #
        "- Address recipient by full name and address\n" #
        "- Use formal legal language throughout\n" #
        "- End with 'Sincerely,' followed by sender's full name\n" #
        "- DO NOT use any placeholder brackets like [NAME] or [DATE] — use the actual provided data\n" #
        "- Calculate the exact compliance deadline date and write it in full (e.g., 'May 15, 2025')\n\n" #

        "Write the complete demand letter now:";
      };
    };
  };

  /// Build the prompt for follow-up / escalation letter generation.
  public func buildFollowUpPrompt(original : Types.GeneratedLetter) : Text {
    let typeStr = letterTypeText(original.formData.letterType);
    let amountStr = formatAmount(original.formData.amountDemanded, original.formData.currency);

    // Sanitise user fields
    let sSenderName    = sanitizeForPrompt(original.formData.senderName, MAX_NAME_LEN);
    let sRecipientName = sanitizeForPrompt(original.formData.recipientName, MAX_NAME_LEN);
    let sSenderPhone   = sanitizeForPrompt(original.formData.senderPhone, MAX_NAME_LEN);
    let sSenderEmail   = sanitizeForPrompt(original.formData.senderEmail, MAX_EMAIL_LEN);
    let sDisputeDesc   = sanitizeForPrompt(original.formData.disputeDescription, MAX_DESCRIPTION_LEN);
    // Letter content is AI-generated, but still sanitise before re-embedding
    let sLetterContent = sanitizeForPrompt(original.letterContent, MAX_DESCRIPTION_LEN);

    "You are an expert attorney drafting an escalated follow-up demand letter. " #
    "The recipient has FAILED TO RESPOND to the initial demand letter sent previously. " #
    "This is a final notice before legal action is filed. " #
    "Write a complete, formal escalated demand letter with NO placeholder brackets. " #
    "The tone must be final warning — this is the last communication before litigation.\n\n" #

    "ORIGINAL LETTER ID: " # original.id # "\n" #
    "LETTER TYPE: " # typeStr # "\n" #
    "JURISDICTION: " # original.formData.jurisdiction # "\n\n" #

    "SENDER: " # sSenderName # "\n" #
    "Address: " # formatAddress(original.formData.senderAddress) # "\n" #
    "Phone: " # sSenderPhone # "\n" #
    "Email: " # sSenderEmail # "\n\n" #

    "RECIPIENT: " # sRecipientName # "\n" #
    "Address: " # formatAddress(original.formData.recipientAddress) # "\n\n" #

    "ORIGINAL DISPUTE: " # sDisputeDesc # "\n" #
    "AMOUNT STILL OWED: " # amountStr # "\n\n" #

    "APPLICABLE STATUTES: " # getWorldLaws("US", original.formData.letterType) # "\n\n" #

    "ORIGINAL LETTER CONTENT (for reference):\n" # sLetterContent # "\n\n" #

    "Write a complete escalated follow-up letter that:\n" #
    "1. References the original demand letter and its date\n" #
    "2. Notes that the deadline has passed without response\n" #
    "3. Reiterates the legal basis with all statute citations\n" #
    "4. States that legal proceedings will commence within 7 days if not resolved\n" #
    "5. Demands immediate response\n" #
    "6. Is signed by " # sSenderName # "\n\n" #
    "Write the complete follow-up letter now:";
  };

  /// Build the prompt for the strength-analysis request.
  public func buildStrengthPrompt(letter : Types.GeneratedLetter) : Text {
    let sLetterContent = sanitizeForPrompt(letter.letterContent, MAX_DESCRIPTION_LEN);
    "You are a legal analyst evaluating the strength of a demand letter. " #
    "Analyse the following demand letter and return a JSON object with exactly this structure:\n" #
    "{\n" #
    "  \"score\": <integer 1-10>,\n" #
    "  \"strengths\": [\"strength1\", \"strength2\", ...],\n" #
    "  \"improvements\": [\"improvement1\", \"improvement2\", ...],\n" #
    "  \"responseLikelihood\": \"Low\" | \"Medium\" | \"High\"\n" #
    "}\n\n" #
    "LETTER TYPE: " # letterTypeText(letter.formData.letterType) # "\n" #
    "JURISDICTION: " # letter.formData.jurisdiction # "\n\n" #
    "LETTER CONTENT:\n" # sLetterContent # "\n\n" #
    "Return ONLY the JSON object, no other text.";
  };

  /// Build the prompt for the Q&A case assistant.
  public func buildQaPrompt(question : Text, letter : Types.GeneratedLetter) : Text {
    let sQuestion      = sanitizeForPrompt(question, MAX_DESCRIPTION_LEN);
    let sDisputeDesc   = sanitizeForPrompt(letter.formData.disputeDescription, MAX_DESCRIPTION_LEN);
    let sLetterContent = sanitizeForPrompt(letter.letterContent, MAX_DESCRIPTION_LEN);
    "You are a knowledgeable legal assistant helping a user understand their " #
    letterTypeText(letter.formData.letterType) # " demand letter case in " #
    letter.formData.jurisdiction # ".\n\n" #
    "CASE CONTEXT:\n" #
    "Dispute: " # sDisputeDesc # "\n" #
    "Letter Content:\n" # sLetterContent # "\n\n" #
    "USER QUESTION: " # sQuestion # "\n\n" #
    "Provide a clear, helpful answer. Note that this is not legal advice and the user " #
    "should consult a licensed attorney for their specific situation.";
  };

  // ── Response parsing ──────────────────────────────────────────────────────

  /// Parse the raw Claude JSON response into a StrengthAnalysis.
  /// Motoko has no JSON library — we do a best-effort text extraction.
  public func parseStrengthResponse(raw : Text) : { #ok : Types.StrengthAnalysis; #err : Text } {
    // Extract score: look for "score": N
    let scoreOpt = extractJsonNat(raw, "\"score\"");
    let score = switch (scoreOpt) {
      case (?s) { if (s >= 1 and s <= 10) s else 5 };
      case null { 5 };
    };

    // Extract responseLikelihood
    let likelihood : Types.ResponseLikelihood = if (
      raw.contains(#text "\"High\"") or raw.contains(#text "\"high\"")
    ) { #High } else if (
      raw.contains(#text "\"Low\"") or raw.contains(#text "\"low\"")
    ) { #Low } else { #Medium };

    // Extract strengths and improvements arrays
    let strengths    = extractJsonArray(raw, "\"strengths\"");
    let improvements = extractJsonArray(raw, "\"improvements\"");

    #ok({
      score;
      strengths;
      improvements;
      responseLikelihood = likelihood;
    });
  };

  // ── JSON extraction helpers ───────────────────────────────────────────────

  /// Find the first integer value after a given key in raw JSON text.
  func extractJsonNat(text : Text, key : Text) : ?Nat {
    let parts = text.split(#text key);
    var isFirst = true;
    var result : ?Nat = null;
    let isWhitespace = func(c : Char) : Bool {
      c == ' ' or c == '\n' or c == '\r' or c == '\t'
    };
    let isDigit = func(c : Char) : Bool { c >= '0' and c <= '9' };
    parts.forEach(func(part : Text) {
      if (isFirst) {
        isFirst := false;
      } else if (result == null) {
        let afterColon = part.split(#text ":");
        afterColon.drop(1).forEach(func(numPart : Text) {
          if (result == null) {
            let trimmed = numPart.trimStart(#predicate isWhitespace);
            let digits = Text.fromIter(
              trimmed.toIter().takeWhile(isDigit)
            );
            if (digits.size() > 0) {
              result := Nat.fromText(digits);
            };
          };
        });
      };
    });
    result;
  };

  /// Extract strings from a JSON array field.
  func extractJsonArray(text : Text, key : Text) : [Text] {
    let parts = text.split(#text key);
    var isFirst = true;
    var result : [Text] = [];
    let dq = '\u{22}';
    let isWsOrQuote = func(c : Char) : Bool {
      c == ' ' or c == '\n' or c == '\r' or c == '\t' or c == dq
    };
    parts.forEach(func(part : Text) {
      if (isFirst) {
        isFirst := false;
      } else if (result.size() == 0) {
        let afterBracket = part.split(#text "[");
        afterBracket.drop(1).forEach(func(arrayPart : Text) {
          if (result.size() == 0) {
            let beforeClose = arrayPart.split(#text "]");
            switch (beforeClose.find(func(_ : Text) : Bool { true })) {
              case (null) {};
              case (?content) {
                let items = content.split(#text ",");
                let extracted = items.filterMap(func(item : Text) : ?Text {
                  let trimmed = item
                    .trimStart(#predicate isWsOrQuote)
                    .trimEnd(#predicate isWsOrQuote);
                  if (trimmed.size() > 0) ?trimmed else null
                });
                result := extracted.toArray();
              };
            };
          };
        });
      };
    });
    result;
  };
};
