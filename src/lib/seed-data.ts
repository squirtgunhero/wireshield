export const DEMO_TRANSACTION = {
  id: "demo-tx-1",
  displayId: "TX-2026-38472",
  status: "ACTIVE" as const,
  currentPhase: "UNDERWRITING" as const,
  propertyAddress: "742 Maple Drive",
  propertyCity: "Montville",
  propertyState: "NJ",
  propertyZip: "07045",
  propertyType: "SFR",
  listPrice: 825000,
  contractPrice: 812000,
  earnestAmount: 24360,
  loanAmount: 649600,
  listingDate: "2026-02-10",
  contractDate: "2026-03-01",
  closingDate: "2026-05-15",
};

export const DEMO_PARTIES = [
  { id: "p1", type: "BUYER", name: "James & Linda Chen", email: "jchen.linda@gmail.com", phone: "9735551234", company: null, verified: true, verifiedAt: "2026-03-01", verificationMethod: "Government ID" },
  { id: "p2", type: "SELLER", name: "Robert & Patricia Morrison", email: "rmorrison@morrisongroup.com", phone: "9735555678", company: "Morrison Group", verified: true, verifiedAt: "2026-02-10", verificationMethod: "Government ID" },
  { id: "p3", type: "BUYER_AGENT", name: "Sarah Kim", email: "skim@gardenstaterealty.com", phone: "9735552345", company: "Garden State Realty", verified: true, verifiedAt: "2026-02-12", verificationMethod: "MLS license" },
  { id: "p4", type: "LISTING_AGENT", name: "Michael Torres", email: "mtorres@njpremier.com", phone: "9735553456", company: "NJ Premier Properties", verified: true, verifiedAt: "2026-02-10", verificationMethod: "MLS license" },
  { id: "p5", type: "TITLE_ESCROW", name: "Jennifer Walsh", email: "jwalsh@keystonetitle.com", phone: "9735554567", company: "Keystone Title Group", verified: true, verifiedAt: "2026-03-05", verificationMethod: "ALTA membership" },
  { id: "p6", type: "LENDER", name: "David Park", email: "dpark@meridianmortgage.com", phone: "9735556789", company: "Meridian Mortgage", verified: true, verifiedAt: "2026-03-10", verificationMethod: "NMLS registry" },
  { id: "p7", type: "ATTORNEY", name: "Angela Russo", email: "arusso@russolaw.com", phone: "9735557890", company: "Russo & Associates", verified: true, verifiedAt: "2026-03-02", verificationMethod: "State Bar verification" },
];

export const DEMO_EVENTS = [
  {
    id: "e1", phase: "LISTING", type: "COMMUNICATION", severity: "SAFE",
    fromPartyId: "p4", toPartyId: "p2",
    subject: "Listing agreement signed and filed",
    detail: "Michael Torres confirmed the listing agreement has been signed by Robert & Patricia Morrison and filed with the MLS. Listed at $825,000.",
    timestamp: "2026-02-10T10:15:00Z", flagged: false,
  },
  {
    id: "e2", phase: "OFFER", type: "COMMUNICATION", severity: "SAFE",
    fromPartyId: "p3", toPartyId: "p4",
    subject: "Purchase offer submitted at $812,000",
    detail: "Sarah Kim submitted a purchase offer on behalf of James & Linda Chen for $812,000 with 3% earnest money deposit. 45-day closing timeline requested.",
    timestamp: "2026-02-28T14:30:00Z", flagged: false,
  },
  {
    id: "e3", phase: "OFFER", type: "COMMUNICATION", severity: "SAFE",
    fromPartyId: "p4", toPartyId: "p3",
    subject: "Offer accepted by sellers",
    detail: "The Morrison family has accepted the offer at $812,000. Contract execution scheduled for March 1st. Congratulations to both parties.",
    timestamp: "2026-03-01T09:00:00Z", flagged: false,
  },
  {
    id: "e4", phase: "EARNEST_MONEY", type: "WIRE", severity: "SAFE",
    fromPartyId: "p1", toPartyId: "p5",
    subject: "Earnest money deposit wired to escrow",
    detail: "James Chen wired the earnest money deposit of $24,360 to Keystone Title Group escrow account. Wire confirmation received.",
    timestamp: "2026-03-03T11:00:00Z", flagged: false,
  },
  {
    id: "e5", phase: "DUE_DILIGENCE", type: "DOCUMENT", severity: "SAFE",
    fromPartyId: "p5", toPartyId: "p7",
    subject: "Title search completed and clear",
    detail: "Keystone Title has completed the title search on 742 Maple Drive. Title is clear with no liens, encumbrances, or easement issues. Report forwarded to Angela Russo for review.",
    timestamp: "2026-03-12T15:45:00Z", flagged: false,
  },
  {
    id: "e6", phase: "DUE_DILIGENCE", type: "COMMUNICATION", severity: "SAFE",
    fromPartyId: "p7", toPartyId: "p3",
    subject: "Attorney review of title and contract complete",
    detail: "Angela Russo has completed the attorney review. All documents are in order. No issues found with the title report or purchase contract. Clear to proceed to underwriting.",
    timestamp: "2026-03-15T10:30:00Z", flagged: false,
  },
  {
    id: "e7", phase: "UNDERWRITING", type: "COMMUNICATION", severity: "CRITICAL",
    fromPartyId: null, fromLabel: "jwalsh@keyst0netitle.com",
    toPartyId: "p1",
    subject: "URGENT: Updated wire instructions for closing",
    detail: "Dear James,\n\nDue to a recent bank audit, we have been required to change our receiving account for all closings effective immediately. Please use the following updated wire instructions for your closing funds:\n\nBank: First National Trust\nRouting: 021000089\nAccount: 4458829173\n\nPlease wire your closing funds to this new account as soon as possible to avoid any delays. This is time sensitive and must be completed before end of business today.\n\nRegards,\nJennifer Walsh\nKeystone Title Group",
    timestamp: "2026-04-02T08:15:00Z", flagged: true,
    threatType: "Wire Fraud / Email Spoofing",
    flags: [
      { text: "Sender domain keyst0netitle.com uses homograph substitution (0 for o) to impersonate keystonetitle.com", severity: "CRITICAL" },
      { text: "Contains updated wire instructions, the most common wire fraud vector", severity: "CRITICAL" },
      { text: "Creates false urgency with 'immediately' and 'end of business today'", severity: "HIGH" },
      { text: "Requests wire to a different account than previously verified", severity: "CRITICAL" },
    ],
    aiSummary: "This is a textbook wire fraud attempt using email domain spoofing. The sender's domain (keyst0netitle.com) substitutes a zero for the letter 'o' to impersonate the legitimate Keystone Title Group domain (keystonetitle.com). The email requests that closing funds be wired to a different account, which is the most common real estate wire fraud attack vector.",
    actionTaken: "Alert generated. Wire flagged for manual verification. Buyer notified to call Jennifer Walsh directly at verified phone number before taking any action.",
  },
  {
    id: "e8", phase: "UNDERWRITING", type: "COMMUNICATION", severity: "HIGH",
    fromPartyId: null, fromLabel: "mtorres@njpremeir.com",
    toPartyId: "p1",
    subject: "Please confirm your identity for closing preparation",
    detail: "Hi James,\n\nAs we approach closing, I need to verify some information for the title company. Could you please provide:\n\n1. Last 4 of your SSN\n2. Date of birth\n3. Current employer name\n\nPlease reply directly to this email. This is standard procedure.\n\nMichael Torres\nNJ Premier Properties",
    timestamp: "2026-04-05T14:22:00Z", flagged: true,
    threatType: "Credential Phishing / Impersonation",
    flags: [
      { text: "Sender domain njpremeir.com is a typo-squatted version of njpremier.com (transposed e and i)", severity: "CRITICAL" },
      { text: "Requesting sensitive personal information (SSN, DOB) via email", severity: "CRITICAL" },
      { text: "Agents would not typically request SSN or DOB directly", severity: "HIGH" },
    ],
    aiSummary: "This is a phishing attempt using a typo-squatted domain. The sender's domain transposes two letters to impersonate the legitimate listing agent's email. It requests sensitive personal information that a real estate agent would never collect via email.",
    actionTaken: "Alert generated. Buyer advised not to respond. Michael Torres contacted at verified phone number to confirm he did not send this email.",
  },
  {
    id: "e9", phase: "UNDERWRITING", type: "COMMUNICATION", severity: "SAFE",
    fromPartyId: "p6", toPartyId: "p3",
    subject: "Loan pre-approval confirmed for $649,600",
    detail: "David Park confirms that the mortgage pre-approval for James & Linda Chen has been issued for $649,600 at 6.25% fixed rate, 30-year term. Final underwriting review is in progress.",
    timestamp: "2026-04-08T16:00:00Z", flagged: false,
  },
  {
    id: "e10", phase: "UNDERWRITING", type: "SYSTEM", severity: "SAFE",
    fromPartyId: null, toPartyId: null,
    subject: "Wire fraud attempt blocked and reported",
    detail: "WireShield's AI analysis detected and blocked the wire fraud attempt from keyst0netitle.com. The fraudulent wire instructions were quarantined. Keystone Title Group has been notified and is working with law enforcement.",
    timestamp: "2026-04-02T09:30:00Z", flagged: false,
  },
  {
    id: "e11", phase: "UNDERWRITING", type: "SYSTEM", severity: "SAFE",
    fromPartyId: null, toPartyId: null,
    subject: "Phishing attempt identified and contained",
    detail: "WireShield flagged the phishing email from njpremeir.com. Michael Torres at NJ Premier Properties confirmed he did not send the email. The impersonation attempt has been reported.",
    timestamp: "2026-04-05T16:00:00Z", flagged: false,
  },
  {
    id: "e12", phase: "UNDERWRITING", type: "COMMUNICATION", severity: "MEDIUM",
    fromPartyId: "p5", toPartyId: "p3",
    subject: "Closing cost estimate and scheduling",
    detail: "Jennifer Walsh (verified) sent the preliminary closing cost breakdown. Estimated buyer closing costs: $18,450. Closing tentatively scheduled for May 15, 2026 at 10:00 AM at Keystone Title Group offices.",
    timestamp: "2026-04-10T11:00:00Z", flagged: false,
  },
  {
    id: "e13", phase: "UNDERWRITING", type: "DOCUMENT", severity: "SAFE",
    fromPartyId: "p6", toPartyId: "p5",
    subject: "Appraisal completed at $820,000",
    detail: "The property appraisal for 742 Maple Drive has been completed. Appraised value: $820,000, which is above the contract price of $812,000. Appraisal report sent to Keystone Title Group.",
    timestamp: "2026-04-12T13:30:00Z", flagged: false,
  },
  {
    id: "e14", phase: "UNDERWRITING", type: "COMMUNICATION", severity: "HIGH",
    fromPartyId: null, fromLabel: "closing-docs@keystonetitle-portal.com",
    toPartyId: "p1",
    subject: "Action required: Sign closing documents online",
    detail: "Dear Mr. Chen,\n\nYour closing documents are ready for electronic signature. Please click the link below to access the secure signing portal:\n\nhttps://keystonetitle-portal.com/sign/doc-38472\n\nYou must complete signing within 24 hours or your closing may be delayed.\n\nKeystone Title Group\nClosing Department",
    timestamp: "2026-04-14T09:00:00Z", flagged: true,
    threatType: "Credential Phishing",
    flags: [
      { text: "Domain keystonetitle-portal.com is not the verified Keystone Title domain (keystonetitle.com)", severity: "CRITICAL" },
      { text: "Contains suspicious link to an unverified portal", severity: "HIGH" },
      { text: "Creates urgency with 24-hour deadline", severity: "HIGH" },
    ],
    aiSummary: "This email directs the buyer to a fraudulent signing portal hosted on a domain that mimics Keystone Title Group. The legitimate title company uses keystonetitle.com. This appears designed to harvest login credentials or collect sensitive information.",
    actionTaken: "Alert generated. Buyer notified. Jennifer Walsh at Keystone Title confirmed they do not use 'keystonetitle-portal.com' for any services.",
  },
];

export const DEMO_WIRES = [
  {
    id: "w1", label: "Earnest money deposit", amount: 24360, phase: "EARNEST_MONEY",
    fromPartyId: "p1", toPartyId: "p5",
    status: "COMPLETED", bankName: "Chase Bank", routingLast4: "4829", accountLast4: "7731",
    verifiedRoutingLast4: "4829", verifiedAccountLast4: "7731",
    verificationMethod: "Callback verification",
    sentAt: "2026-03-03T11:00:00Z", confirmedAt: "2026-03-03T14:00:00Z",
  },
  {
    id: "w2", label: "Buyer closing funds", amount: 162400, phase: "CLOSING",
    fromPartyId: "p1", toPartyId: "p5",
    status: "PENDING_VERIFICATION", bankName: "Chase Bank", routingLast4: "4829", accountLast4: "7731",
    verificationMethod: null,
  },
  {
    id: "w3", label: "Mortgage disbursement", amount: 649600, phase: "CLOSING",
    fromPartyId: "p6", toPartyId: "p5",
    status: "PENDING", bankName: "Meridian Mortgage", routingLast4: "0021", accountLast4: "3390",
    verificationMethod: null,
  },
  {
    id: "w4", label: "Seller proceeds", amount: 785640, phase: "POST_CLOSING",
    fromPartyId: "p5", toPartyId: "p2",
    status: "PENDING", bankName: "Keystone Title Escrow", routingLast4: "6612", accountLast4: "8847",
    verificationMethod: null,
  },
];

export const DEMO_DOCUMENTS = [
  { id: "d1", name: "Listing agreement", phase: "LISTING", status: "VERIFIED", signatories: ["p2", "p4"], signedAt: "2026-02-10" },
  { id: "d2", name: "Purchase agreement", phase: "OFFER", status: "VERIFIED", signatories: ["p1", "p2", "p3", "p4"], signedAt: "2026-03-01" },
  { id: "d3", name: "Earnest money receipt", phase: "EARNEST_MONEY", status: "VERIFIED", signatories: ["p5"], signedAt: "2026-03-03" },
  { id: "d4", name: "Title search report", phase: "DUE_DILIGENCE", status: "VERIFIED", signatories: ["p5"], signedAt: "2026-03-12" },
  { id: "d5", name: "Home inspection report", phase: "DUE_DILIGENCE", status: "VERIFIED", signatories: ["p1", "p3"], signedAt: "2026-03-08" },
  { id: "d6", name: "Attorney review letter", phase: "DUE_DILIGENCE", status: "VERIFIED", signatories: ["p7"], signedAt: "2026-03-15" },
  { id: "d7", name: "Mortgage pre-approval", phase: "UNDERWRITING", status: "VERIFIED", signatories: ["p6"], signedAt: "2026-04-08" },
  { id: "d8", name: "Appraisal report", phase: "UNDERWRITING", status: "SUBMITTED", signatories: ["p6"], signedAt: "2026-04-12" },
  { id: "d9", name: "Closing disclosure", phase: "CLOSING", status: "PENDING", signatories: [], signedAt: null },
];

export const DEMO_ALERTS = [
  {
    id: "a1", severity: "CRITICAL", eventId: "e7",
    title: "Wire fraud attempt detected",
    description: "A spoofed email from keyst0netitle.com (homograph of keystonetitle.com) attempted to redirect closing funds to a fraudulent bank account. The email contained updated wire instructions with urgency language designed to pressure immediate action.",
    status: "INVESTIGATING",
    createdAt: "2026-04-02T08:30:00Z",
  },
  {
    id: "a2", severity: "HIGH", eventId: "e8",
    title: "Credential phishing via impersonation",
    description: "A phishing email from njpremeir.com (typo-squatted domain mimicking njpremier.com) attempted to collect the buyer's SSN and date of birth. The sender impersonated the listing agent Michael Torres.",
    status: "ACTIVE",
    createdAt: "2026-04-05T14:30:00Z",
  },
  {
    id: "a3", severity: "HIGH", eventId: "e14",
    title: "Fraudulent signing portal detected",
    description: "An email directed the buyer to a fake document signing portal at keystonetitle-portal.com. The legitimate title company confirmed they do not operate this domain. This is likely a credential harvesting attempt.",
    status: "ACTIVE",
    createdAt: "2026-04-14T09:15:00Z",
  },
];

export const TRAINING_SCENARIOS = [
  {
    id: "s1", role: "Buyer", title: "The last-minute wire change", difficulty: "Medium",
    description: "You are three days from closing on your first home. An email arrives from what appears to be your title company with new wire instructions.",
    email: {
      from: "jwalsh@keyst0netitle.com",
      to: "you@email.com",
      subject: "URGENT: Updated wire instructions for your closing",
      body: `Dear Homebuyer,

Due to a recent bank audit, our escrow account has been temporarily frozen. We have set up a new receiving account for all closings effective immediately.

Please use the following updated wire instructions for your closing funds of $162,400:

Bank: First National Trust
Routing: 021000089
Account: 4458829173
Reference: Your file number 2026-38472

This must be completed before end of business today to avoid delaying your closing. Please do NOT use the previous wire instructions as they are no longer active.

If you have any questions, reply to this email directly.

Best regards,
Jennifer Walsh
Keystone Title Group
Senior Closing Officer`,
    },
    redFlags: [
      { text: "The sender domain keyst0netitle.com substitutes a zero for the letter 'o' to impersonate keystonetitle.com", severity: "CRITICAL" },
      { text: "Claims the escrow account is 'frozen' due to a 'bank audit,' which is extremely unusual and would not result in a last-minute account change", severity: "HIGH" },
      { text: "Creates extreme urgency with 'end of business today' and 'immediately'", severity: "HIGH" },
      { text: "Directs you to reply to the spoofed email rather than calling a verified number", severity: "MEDIUM" },
      { text: "Tells you NOT to use the previous (legitimate) wire instructions", severity: "HIGH" },
    ],
    correctAction: "Do NOT wire any money. Call Jennifer Walsh at Keystone Title Group using the phone number from your original closing documents or your agent's contact list. Verify the wire instructions verbally. Report the phishing email to your agent, title company, and local FBI field office (ic3.gov).",
  },
  {
    id: "s2", role: "Buyer", title: "The fake listing deposit", difficulty: "Easy",
    description: "You found a rental listing on Craigslist for an unbelievable deal. The 'landlord' asks you to wire a deposit to secure the property before your tour.",
    email: {
      from: "property.owner2026@gmail.com",
      to: "you@email.com",
      subject: "RE: 45 Oak Street Rental - Deposit to Secure",
      body: `Hi,

Thank you for your interest in 45 Oak Street. I have several people who want to view it this weekend, so I want to give you first chance since you contacted me first.

To hold the property, I need a deposit of $2,400 (first month's rent) sent via Zelle to this email address. Once I receive it, I will schedule your private showing and take the listing down.

The property is available for move-in March 1st. This is well below market rate because I need to rent it quickly - I was transferred for work.

Let me know if you're interested. I can also accept Venmo or Cash App.

Thanks,
Robert`,
    },
    redFlags: [
      { text: "Requesting payment via Zelle, Venmo, or Cash App, which offer no fraud protection for this type of transaction", severity: "CRITICAL" },
      { text: "Asking for money before you have even seen the property in person", severity: "CRITICAL" },
      { text: "Sender is using a free Gmail account, not a property management company", severity: "MEDIUM" },
      { text: "'Well below market rate' and 'transferred for work' are classic rental scam narratives", severity: "HIGH" },
      { text: "Creating urgency by claiming multiple interested parties", severity: "HIGH" },
    ],
    correctAction: "Never send money for a property you have not physically visited. Verify the property ownership through public records. Search the address online to check if it is listed legitimately elsewhere. If the deal seems too good to be true, it almost certainly is.",
  },
  {
    id: "s3", role: "Seller", title: "The proceeds redirect", difficulty: "Hard",
    description: "You just closed on the sale of your home. An email from what appears to be your attorney asks you to update your bank information for the proceeds wire.",
    email: {
      from: "angela.russo@russ0law.com",
      to: "you@email.com",
      subject: "Important: Updated banking information needed for proceeds",
      body: `Dear Robert,

Congratulations on the successful closing of 742 Maple Drive. Your net proceeds of $785,640 are ready for disbursement.

Before we can release the funds, I need you to confirm your current banking information. Our records show your previous account at First National, but per our conversation, you mentioned wanting to change the receiving account.

Please provide:
- Bank name
- Routing number
- Account number
- Account holder name

For security purposes, please reply directly to this email rather than calling the office, as our phone system is being updated today.

Thank you,
Angela Russo, Esq.
Russo & Associates`,
    },
    redFlags: [
      { text: "Sender domain russ0law.com uses a zero instead of 'o' to impersonate russolaw.com", severity: "CRITICAL" },
      { text: "Requesting full banking details via email is a major red flag", severity: "CRITICAL" },
      { text: "Claims you mentioned wanting to change accounts, creating false context to justify the request", severity: "HIGH" },
      { text: "Explicitly asks you NOT to call the office, preventing verbal verification", severity: "HIGH" },
      { text: "Convenient excuse about phone system being updated", severity: "MEDIUM" },
    ],
    correctAction: "Do NOT reply with any banking information. Call Angela Russo at Russo & Associates using the phone number from your original engagement letter. Verify whether this email is legitimate. Report the attempt to your title company, real estate agent, and local law enforcement.",
  },
  {
    id: "s4", role: "Seller", title: "The title theft attempt", difficulty: "Hard",
    description: "You receive a notification about a deed transfer you never authorized on a property you still own.",
    email: {
      from: "notifications@countyrecords-nj.com",
      to: "you@email.com",
      subject: "Deed Transfer Recorded - Morris County",
      body: `MORRIS COUNTY RECORDER'S OFFICE
NOTIFICATION OF RECORDED INSTRUMENT

A new deed has been recorded for the following property:

Property: 742 Maple Drive, Montville, NJ 07045
Instrument: Warranty Deed
Recording Date: April 20, 2026
Document #: 2026-MC-048291
Grantor: Robert Morrison
Grantee: Pacific Coast Holdings LLC

If you did not authorize this transfer, you must act within 72 hours. Click below to dispute:

https://countyrecords-nj.com/dispute/2026-MC-048291

Failure to respond within 72 hours constitutes acceptance of the recorded transfer.

Morris County Recorder's Office
Automated Notification System`,
    },
    redFlags: [
      { text: "County offices send notices by physical mail, not email, for deed recordings", severity: "HIGH" },
      { text: "Domain countyrecords-nj.com is not a legitimate government domain (would be .gov)", severity: "CRITICAL" },
      { text: "72-hour ultimatum is fabricated pressure. Government processes do not work this way", severity: "HIGH" },
      { text: "The dispute link leads to a non-government website designed to harvest your information", severity: "CRITICAL" },
      { text: "Transfer to an LLC is a common title theft pattern", severity: "MEDIUM" },
    ],
    correctAction: "Do NOT click the link. Contact the Morris County Recorder's Office directly using the number on the official county website (not from this email). Verify whether any deed transfer has actually been recorded. If fraudulent, contact local law enforcement and consider filing a property fraud alert with the county.",
  },
  {
    id: "s5", role: "Agent", title: "The earnest money redirect", difficulty: "Easy",
    description: "Your buyer client just received wire instructions for the earnest money deposit, but something looks off.",
    email: {
      from: "closings@keystone-titlegroup.com",
      to: "buyer@email.com",
      subject: "Wire Instructions for Earnest Money - 742 Maple Dr",
      body: `Dear Mr. Chen,

Please find the wire instructions for your earnest money deposit of $24,360:

Bank: International Wire Services Corp
Routing: 091000019
Account: 7742901563
Reference: File #2026-38472

Please wire funds within 48 hours of contract execution. Contact this office if you need assistance.

Keystone Title Group
Closings Department`,
    },
    redFlags: [
      { text: "Domain is keystone-titlegroup.com, not the verified keystonetitle.com", severity: "CRITICAL" },
      { text: "'International Wire Services Corp' is not a recognized bank and sounds like a pass-through entity", severity: "HIGH" },
      { text: "Legitimate escrow accounts are held at established banks, not wire services companies", severity: "HIGH" },
    ],
    correctAction: "As the agent, immediately call Keystone Title Group at their verified phone number to confirm these wire instructions. Never rely solely on emailed wire instructions. Advise your client to wait until you have verbally confirmed the correct banking information.",
  },
  {
    id: "s6", role: "Agent", title: "The seller impersonation", difficulty: "Hard",
    description: "You receive an email from what appears to be your seller client asking you to handle the closing proceeds differently than originally planned.",
    email: {
      from: "r.morrison.property@outlook.com",
      to: "mtorres@njpremier.com",
      subject: "Change in closing proceeds - confidential",
      body: `Michael,

I need to make a change to how my closing proceeds are distributed. Patricia and I have decided to have the funds split between two accounts. This is related to a private family matter, so please keep this between us.

Account 1 (main): Our original account - $500,000
Account 2 (new): Route remaining $285,640 to:
  Bank: Coastal Savings
  Routing: 067014822
  Account: 302918475
  Name: RM Holdings LLC

Please handle this directly with title. I would prefer if Patricia is not CC'd on any correspondence about this split, as it relates to a surprise I'm planning.

Thanks for understanding,
Robert Morrison`,
    },
    redFlags: [
      { text: "Sender is using an Outlook account, not the verified morrisongroup.com domain", severity: "CRITICAL" },
      { text: "Requesting secrecy and asking not to include the co-seller is a major BEC indicator", severity: "CRITICAL" },
      { text: "Splitting proceeds to a new LLC with a vague explanation", severity: "HIGH" },
      { text: "'Private family matter' and 'surprise' are social engineering tactics to prevent verification", severity: "HIGH" },
    ],
    correctAction: "Do NOT make any changes to the proceeds distribution. Call Robert Morrison at his verified phone number to confirm this request. Inform your broker. Any changes to wire instructions or proceeds distribution must be verified verbally with all parties present.",
  },
  {
    id: "s7", role: "Title/Escrow", title: "The spoofed agent wire update", difficulty: "Medium",
    description: "You are the closing officer. A buyer's agent sends updated wire instructions for the buyer's closing funds, but the request has some concerning elements.",
    email: {
      from: "sarah.kim@gardenstate-realty.com",
      to: "jwalsh@keystonetitle.com",
      subject: "Updated wire details for Chen closing - 742 Maple Dr",
      body: `Jennifer,

James Chen has changed banks and needs the closing funds wired to his new account. Here are the updated details:

Bank: National Commerce Bank
Routing: 061092387
Account: 556290143
Account Holder: J. Chen

Please update your records before the May 15th closing. James authorized me to make this change on his behalf so he wouldn't have to deal with the paperwork.

Thanks,
Sarah Kim
Garden State Realty`,
    },
    redFlags: [
      { text: "Domain gardenstate-realty.com does not match the verified gardenstaterealty.com (added hyphen)", severity: "CRITICAL" },
      { text: "Agent is making banking changes 'on behalf of' the buyer, which circumvents verification protocols", severity: "HIGH" },
      { text: "Wire instruction changes should come directly from the account holder, not through a third party", severity: "HIGH" },
      { text: "Reasoning that the buyer 'wouldn't have to deal with the paperwork' is designed to prevent direct contact", severity: "MEDIUM" },
    ],
    correctAction: "As the title officer, do NOT update any wire instructions based on email alone. Call Sarah Kim at Garden State Realty using your verified contact information. Then call James Chen directly to confirm any banking changes. All wire instruction changes require direct verbal confirmation from the account holder.",
  },
  {
    id: "s8", role: "Lender", title: "The synthetic borrower", difficulty: "Hard",
    description: "You are reviewing a mortgage application that has passed initial automated screening, but your manual review reveals concerning inconsistencies.",
    email: {
      from: "review-team@meridianmortgage.com",
      to: "dpark@meridianmortgage.com",
      subject: "Manual review flag: Application #2026-LN-09284",
      body: `David,

Automated screening passed application #2026-LN-09284, but the following inconsistencies were flagged during quality review:

Applicant: James Chen
SSN last 4: 8847
- Credit report shows first credit activity 14 months ago
- Employment verification returned "unable to confirm" from stated employer
- IP address of online application geolocated to different state than stated residence
- Phone number on application is a VoIP number, not a mobile carrier
- Utility bills provided show a slightly different address format than credit report

The applicant has a 740 credit score with clean history, which typically would not trigger concerns.

Please review and determine next steps.

Compliance Team`,
    },
    redFlags: [
      { text: "Credit history of only 14 months suggests a recently fabricated synthetic identity", severity: "CRITICAL" },
      { text: "Employment 'unable to confirm' despite appearing legitimate on the application", severity: "HIGH" },
      { text: "IP geolocation mismatch between application origin and stated residence", severity: "HIGH" },
      { text: "VoIP phone number instead of a carrier-issued mobile number", severity: "MEDIUM" },
      { text: "Subtle address discrepancies between documents can indicate fabricated identity documents", severity: "MEDIUM" },
    ],
    correctAction: "Escalate this application for enhanced due diligence. Request in-person identity verification with original government-issued ID. Conduct manual employment verification through independent research. File a Suspicious Activity Report (SAR) with FinCEN if synthetic identity fraud is confirmed.",
  },
  {
    id: "s9", role: "Attorney", title: "The trust account raid", difficulty: "Hard",
    description: "You are a real estate attorney. Your office manager forwards an email that appears to be from a client requesting an urgent wire from your trust account.",
    email: {
      from: "rmorrison@morrisongrp.com",
      to: "office@russolaw.com",
      subject: "Urgent wire from trust account",
      body: `Angela,

I need you to wire $150,000 from the trust account being held for the Maple Drive closing. I'm finalizing another property purchase that closes today and need the funds immediately as a bridge.

Wire to:
Bank: Metro Commercial Bank
Routing: 026009593
Account: 840217653
Reference: Morrison Bridge Loan

I have already spoken with Jennifer at Keystone Title and she is aware. I'll sign the authorization when I'm back in town next week. Please proceed now to avoid losing the other deal.

Robert Morrison`,
    },
    redFlags: [
      { text: "Domain morrisongrp.com is not the verified morrisongroup.com (truncated 'group' to 'grp')", severity: "CRITICAL" },
      { text: "Requesting trust account funds for an unrelated transaction is a serious ethical violation", severity: "CRITICAL" },
      { text: "Asking to sign authorization 'next week' after the wire has already been sent", severity: "HIGH" },
      { text: "Claims to have already spoken with the title officer to create false legitimacy", severity: "HIGH" },
      { text: "Extreme urgency about losing another deal prevents careful consideration", severity: "MEDIUM" },
    ],
    correctAction: "Do NOT wire any funds. Trust account disbursements require proper authorization documentation BEFORE the wire. Call Robert Morrison at his verified phone number. Contact Jennifer Walsh at Keystone Title to verify the claim. Report the attempt to your state bar association. Trust account fraud is a serious criminal offense.",
  },
  {
    id: "s10", role: "Brokerage", title: "The agent credential harvest", difficulty: "Medium",
    description: "You manage a brokerage. Multiple agents report receiving an email about a mandatory system update that requires them to re-enter their credentials.",
    email: {
      from: "admin@njpremier-systems.com",
      to: "all-agents@njpremier.com",
      subject: "Mandatory: MLS access update required by April 30",
      body: `Attention all NJ Premier Properties agents,

The NJMLS system is undergoing a security upgrade. All agents must re-verify their login credentials by April 30, 2026 to maintain access.

Click here to verify: https://njpremier-systems.com/mls-verify

You will need to enter:
- Your NJMLS username and password
- Your NJ Premier agent ID
- Your email password for verification

Agents who do not complete this process will have their MLS access suspended on May 1st.

This is mandatory per NJMLS policy directive 2026-04.

IT Administration
NJ Premier Properties`,
    },
    redFlags: [
      { text: "Domain njpremier-systems.com is not an official NJ Premier Properties or NJMLS domain", severity: "CRITICAL" },
      { text: "Requesting email passwords alongside MLS credentials is never legitimate", severity: "CRITICAL" },
      { text: "MLS systems never require password re-verification via email links", severity: "HIGH" },
      { text: "Threat of access suspension creates urgency to comply without thinking", severity: "HIGH" },
      { text: "Fake 'policy directive' reference adds false legitimacy", severity: "MEDIUM" },
    ],
    correctAction: "Alert all agents immediately that this is a phishing attempt. Do NOT click the link. Contact NJMLS directly to confirm there is no such security upgrade. Report the phishing domain. Implement company-wide phishing awareness training. Consider requiring two-factor authentication for all brokerage systems.",
  },
];
