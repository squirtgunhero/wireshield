import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const org = await prisma.organization.create({
    data: {
      name: "Keystone Title Group",
      type: "TITLE_COMPANY",
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@wireshield.io",
      fullName: "Michael Ehrlich",
      role: "ADMIN",
      phone: "+19735550001",
      identityVerified: true,
      identityVerifiedAt: new Date("2026-01-01"),
      identityProvider: "manual",
      identityConfidenceScore: 100,
    },
  });

  const buyerUser = await prisma.user.create({
    data: {
      email: "jchen.linda@gmail.com",
      fullName: "James Chen",
      role: "BUYER",
      phone: "+19735551234",
      identityVerified: true,
      identityVerifiedAt: new Date("2026-03-01"),
      identityProvider: "persona",
      identityConfidenceScore: 98.5,
    },
  });

  const sellerUser = await prisma.user.create({
    data: {
      email: "rmorrison@morrisongroup.com",
      fullName: "Robert Morrison",
      role: "SELLER",
      phone: "+19735555678",
      organizationId: null,
      identityVerified: true,
      identityVerifiedAt: new Date("2026-02-10"),
      identityProvider: "persona",
      identityConfidenceScore: 99.0,
    },
  });

  const buyerAgentUser = await prisma.user.create({
    data: {
      email: "skim@gardenstaterealty.com",
      fullName: "Sarah Kim",
      role: "AGENT",
      phone: "+19735552345",
      identityVerified: true,
      identityVerifiedAt: new Date("2026-02-12"),
      identityProvider: "mls",
    },
  });

  const listingAgentUser = await prisma.user.create({
    data: {
      email: "mtorres@njpremier.com",
      fullName: "Michael Torres",
      role: "AGENT",
      phone: "+19735553456",
      identityVerified: true,
      identityVerifiedAt: new Date("2026-02-10"),
      identityProvider: "mls",
    },
  });

  const titleOfficerUser = await prisma.user.create({
    data: {
      email: "jwalsh@keystonetitle.com",
      fullName: "Jennifer Walsh",
      role: "TITLE_OFFICER",
      phone: "+19735554567",
      organizationId: org.id,
      identityVerified: true,
      identityVerifiedAt: new Date("2026-03-05"),
      identityProvider: "alta",
    },
  });

  const lenderUser = await prisma.user.create({
    data: {
      email: "dpark@meridianmortgage.com",
      fullName: "David Park",
      role: "LENDER",
      phone: "+19735556789",
      identityVerified: true,
      identityVerifiedAt: new Date("2026-03-10"),
      identityProvider: "nmls",
    },
  });

  const attorneyUser = await prisma.user.create({
    data: {
      email: "arusso@russolaw.com",
      fullName: "Angela Russo",
      role: "ATTORNEY",
      phone: "+19735557890",
      identityVerified: true,
      identityVerifiedAt: new Date("2026-03-02"),
      identityProvider: "state_bar",
    },
  });

  const tx = await prisma.transaction.create({
    data: {
      transactionType: "PURCHASE",
      status: "ACTIVE",
      currentPhase: "UNDERWRITING",
      propertyAddress: "742 Maple Drive",
      propertyCity: "Montville",
      propertyState: "NJ",
      propertyZip: "07045",
      purchasePrice: 812000,
      expectedCloseDate: new Date("2026-05-15"),
      riskScore: 72,
      riskLevel: "HIGH",
      insuranceTier: "PREMIUM",
      insuranceCoverageAmount: 812000,
      createdById: adminUser.id,
    },
  });

  const [buyerParty, sellerParty, buyerAgentParty, listingAgentParty, titleParty, lenderParty, attorneyParty] =
    await Promise.all([
      prisma.transactionParty.create({
        data: {
          transactionId: tx.id, userId: buyerUser.id, role: "BUYER", status: "VERIFIED",
          verifiedAt: new Date("2026-03-01"),
          name: "James & Linda Chen", email: "jchen.linda@gmail.com", phone: "+19735551234",
        },
      }),
      prisma.transactionParty.create({
        data: {
          transactionId: tx.id, userId: sellerUser.id, role: "SELLER", status: "VERIFIED",
          verifiedAt: new Date("2026-02-10"),
          name: "Robert & Patricia Morrison", email: "rmorrison@morrisongroup.com", phone: "+19735555678", company: "Morrison Group",
        },
      }),
      prisma.transactionParty.create({
        data: {
          transactionId: tx.id, userId: buyerAgentUser.id, role: "BUYER_AGENT", status: "VERIFIED",
          verifiedAt: new Date("2026-02-12"),
          name: "Sarah Kim", email: "skim@gardenstaterealty.com", phone: "+19735552345", company: "Garden State Realty",
        },
      }),
      prisma.transactionParty.create({
        data: {
          transactionId: tx.id, userId: listingAgentUser.id, role: "LISTING_AGENT", status: "VERIFIED",
          verifiedAt: new Date("2026-02-10"),
          name: "Michael Torres", email: "mtorres@njpremier.com", phone: "+19735553456", company: "NJ Premier Properties",
        },
      }),
      prisma.transactionParty.create({
        data: {
          transactionId: tx.id, userId: titleOfficerUser.id, role: "TITLE_OFFICER", status: "VERIFIED",
          verifiedAt: new Date("2026-03-05"),
          name: "Jennifer Walsh", email: "jwalsh@keystonetitle.com", phone: "+19735554567", company: "Keystone Title Group",
        },
      }),
      prisma.transactionParty.create({
        data: {
          transactionId: tx.id, userId: lenderUser.id, role: "LENDER", status: "VERIFIED",
          verifiedAt: new Date("2026-03-10"),
          name: "David Park", email: "dpark@meridianmortgage.com", phone: "+19735556789", company: "Meridian Mortgage",
        },
      }),
      prisma.transactionParty.create({
        data: {
          transactionId: tx.id, userId: attorneyUser.id, role: "ATTORNEY", status: "VERIFIED",
          verifiedAt: new Date("2026-03-02"),
          name: "Angela Russo", email: "arusso@russolaw.com", phone: "+19735557890", company: "Russo & Associates",
        },
      }),
    ]);

  await prisma.wireInstruction.createMany({
    data: [
      {
        transactionId: tx.id, submittedById: titleOfficerUser.id, direction: "INCOMING",
        bankName: "Chase Bank", routingNumber: "****4829", accountNumberEncrypted: "ENC:****7731",
        accountHolderName: "James Chen", amount: 24360,
        status: "CONFIRMED", plaidVerified: true, accountAgeDays: 2190,
        fromPartyId: buyerParty.id, toPartyId: titleParty.id,
        deliveredAt: new Date("2026-03-03T10:00:00Z"),
        confirmedAt: new Date("2026-03-03T14:00:00Z"),
      },
      {
        transactionId: tx.id, submittedById: titleOfficerUser.id, direction: "INCOMING",
        bankName: "Chase Bank", routingNumber: "****4829", accountNumberEncrypted: "ENC:****7731",
        accountHolderName: "James Chen", amount: 162400,
        status: "PENDING", plaidVerified: false,
        fromPartyId: buyerParty.id, toPartyId: titleParty.id,
      },
      {
        transactionId: tx.id, submittedById: lenderUser.id, direction: "INCOMING",
        bankName: "Meridian Mortgage", routingNumber: "****0021", accountNumberEncrypted: "ENC:****3390",
        accountHolderName: "Meridian Mortgage Corp", amount: 649600,
        status: "PENDING", plaidVerified: false,
        fromPartyId: lenderParty.id, toPartyId: titleParty.id,
      },
      {
        transactionId: tx.id, submittedById: titleOfficerUser.id, direction: "OUTGOING",
        bankName: "Keystone Title Escrow", routingNumber: "****6612", accountNumberEncrypted: "ENC:****8847",
        accountHolderName: "Robert Morrison", amount: 785640,
        status: "PENDING", plaidVerified: false,
        fromPartyId: titleParty.id, toPartyId: sellerParty.id,
      },
    ],
  });

  const events = await Promise.all([
    prisma.event.create({
      data: {
        transactionId: tx.id, phase: "LISTING", type: "COMMUNICATION", severity: "SAFE",
        fromPartyId: listingAgentParty.id, toPartyId: sellerParty.id,
        subject: "Listing agreement signed and filed",
        detail: "Michael Torres confirmed the listing agreement has been signed by Robert & Patricia Morrison and filed with the MLS. Listed at $825,000.",
        timestamp: new Date("2026-02-10T10:15:00Z"),
      },
    }),
    prisma.event.create({
      data: {
        transactionId: tx.id, phase: "OFFER", type: "COMMUNICATION", severity: "SAFE",
        fromPartyId: buyerAgentParty.id, toPartyId: listingAgentParty.id,
        subject: "Purchase offer submitted at $812,000",
        detail: "Sarah Kim submitted a purchase offer on behalf of James & Linda Chen for $812,000 with 3% earnest money deposit. 45-day closing timeline requested.",
        timestamp: new Date("2026-02-28T14:30:00Z"),
      },
    }),
    prisma.event.create({
      data: {
        transactionId: tx.id, phase: "UNDERWRITING", type: "COMMUNICATION", severity: "CRITICAL",
        fromLabel: "jwalsh@keyst0netitle.com", toPartyId: buyerParty.id,
        subject: "URGENT: Updated wire instructions for closing",
        detail: "Dear James,\n\nDue to a recent bank audit, we have been required to change our receiving account for all closings effective immediately. Please use the following updated wire instructions for your closing funds:\n\nBank: First National Trust\nRouting: 021000089\nAccount: 4458829173\n\nPlease wire your closing funds to this new account as soon as possible to avoid any delays. This is time sensitive and must be completed before end of business today.\n\nRegards,\nJennifer Walsh\nKeystone Title Group",
        timestamp: new Date("2026-04-02T08:15:00Z"),
        flagged: true,
        threatType: "Wire Fraud / Email Spoofing",
        flags: [
          { text: "Sender domain keyst0netitle.com uses homograph substitution (0 for o)", severity: "CRITICAL" },
          { text: "Contains updated wire instructions, the most common wire fraud vector", severity: "CRITICAL" },
          { text: "Creates false urgency with 'immediately' and 'end of business today'", severity: "HIGH" },
          { text: "Requests wire to a different account than previously verified", severity: "CRITICAL" },
        ],
        aiSummary: "Textbook wire fraud attempt using email domain spoofing. The sender's domain substitutes a zero for the letter 'o' to impersonate Keystone Title Group.",
      },
    }),
    prisma.event.create({
      data: {
        transactionId: tx.id, phase: "UNDERWRITING", type: "COMMUNICATION", severity: "HIGH",
        fromLabel: "mtorres@njpremeir.com", toPartyId: buyerParty.id,
        subject: "Please confirm your identity for closing preparation",
        detail: "Hi James,\n\nAs we approach closing, I need to verify some information for the title company. Could you please provide:\n\n1. Last 4 of your SSN\n2. Date of birth\n3. Current employer name\n\nPlease reply directly to this email. This is standard procedure.\n\nMichael Torres\nNJ Premier Properties",
        timestamp: new Date("2026-04-05T14:22:00Z"),
        flagged: true,
        threatType: "Credential Phishing / Impersonation",
        flags: [
          { text: "Sender domain njpremeir.com is a typo-squatted version of njpremier.com", severity: "CRITICAL" },
          { text: "Requesting sensitive personal information (SSN, DOB) via email", severity: "CRITICAL" },
        ],
        aiSummary: "Phishing attempt using a typo-squatted domain to impersonate the listing agent and collect sensitive personal information.",
      },
    }),
    prisma.event.create({
      data: {
        transactionId: tx.id, phase: "UNDERWRITING", type: "COMMUNICATION", severity: "HIGH",
        fromLabel: "closing-docs@keystonetitle-portal.com", toPartyId: buyerParty.id,
        subject: "Action required: Sign closing documents online",
        detail: "Dear Mr. Chen,\n\nYour closing documents are ready for electronic signature. Please click the link below to access the secure signing portal:\n\nhttps://keystonetitle-portal.com/sign/doc-38472\n\nYou must complete signing within 24 hours or your closing may be delayed.\n\nKeystone Title Group\nClosing Department",
        timestamp: new Date("2026-04-14T09:00:00Z"),
        flagged: true,
        threatType: "Credential Phishing",
        flags: [
          { text: "Domain keystonetitle-portal.com is not the verified Keystone Title domain", severity: "CRITICAL" },
          { text: "Contains suspicious link to an unverified portal", severity: "HIGH" },
          { text: "Creates urgency with 24-hour deadline", severity: "HIGH" },
        ],
        aiSummary: "Email directs buyer to a fraudulent signing portal hosted on a domain that mimics Keystone Title Group.",
      },
    }),
    prisma.event.create({
      data: {
        transactionId: tx.id, phase: "UNDERWRITING", type: "COMMUNICATION", severity: "SAFE",
        fromPartyId: lenderParty.id, toPartyId: buyerAgentParty.id,
        subject: "Loan pre-approval confirmed for $649,600",
        detail: "David Park confirms that the mortgage pre-approval for James & Linda Chen has been issued for $649,600 at 6.25% fixed rate, 30-year term.",
        timestamp: new Date("2026-04-08T16:00:00Z"),
      },
    }),
  ]);

  const wireFraudEvent = events[2];
  const phishingEvent = events[3];
  const portalEvent = events[4];

  await prisma.riskEvent.createMany({
    data: [
      {
        transactionId: tx.id, eventType: "WIRE_FRAUD", severity: "CRITICAL",
        title: "Wire fraud attempt detected - spoofed title company domain",
        description: "keyst0netitle.com impersonating keystonetitle.com with updated wire instructions.",
        metadata: { fromEmail: "jwalsh@keyst0netitle.com", realDomain: "keystonetitle.com" },
      },
      {
        transactionId: tx.id, eventType: "PHISHING", severity: "HIGH",
        title: "Credential phishing via impersonation",
        description: "njpremeir.com impersonating njpremier.com requesting SSN and DOB.",
        metadata: { fromEmail: "mtorres@njpremeir.com", realDomain: "njpremier.com" },
      },
      {
        transactionId: tx.id, eventType: "PHISHING", severity: "HIGH",
        title: "Fraudulent signing portal detected",
        description: "keystonetitle-portal.com used to host fake document signing portal.",
        metadata: { fromEmail: "closing-docs@keystonetitle-portal.com" },
      },
    ],
  });

  await prisma.alert.createMany({
    data: [
      {
        transactionId: tx.id, eventId: wireFraudEvent.id, severity: "CRITICAL",
        title: "Wire fraud attempt detected",
        description: "A spoofed email from keyst0netitle.com attempted to redirect closing funds to a fraudulent bank account.",
        status: "INVESTIGATING",
      },
      {
        transactionId: tx.id, eventId: phishingEvent.id, severity: "HIGH",
        title: "Credential phishing via impersonation",
        description: "A phishing email from njpremeir.com attempted to collect the buyer's SSN and date of birth.",
        status: "ACTIVE",
      },
      {
        transactionId: tx.id, eventId: portalEvent.id, severity: "HIGH",
        title: "Fraudulent signing portal detected",
        description: "An email directed the buyer to a fake document signing portal at keystonetitle-portal.com.",
        status: "ACTIVE",
      },
    ],
  });

  await prisma.document.createMany({
    data: [
      { transactionId: tx.id, name: "Listing agreement", phase: "LISTING", status: "VERIFIED", signatories: [sellerParty.id, listingAgentParty.id], signedAt: new Date("2026-02-10") },
      { transactionId: tx.id, name: "Purchase agreement", phase: "OFFER", status: "VERIFIED", signatories: [buyerParty.id, sellerParty.id, buyerAgentParty.id, listingAgentParty.id], signedAt: new Date("2026-03-01") },
      { transactionId: tx.id, name: "Earnest money receipt", phase: "EARNEST_MONEY", status: "VERIFIED", signatories: [titleParty.id], signedAt: new Date("2026-03-03") },
      { transactionId: tx.id, name: "Title search report", phase: "DUE_DILIGENCE", status: "VERIFIED", signatories: [titleParty.id], signedAt: new Date("2026-03-12") },
      { transactionId: tx.id, name: "Home inspection report", phase: "DUE_DILIGENCE", status: "VERIFIED", signatories: [buyerParty.id, buyerAgentParty.id], signedAt: new Date("2026-03-08") },
      { transactionId: tx.id, name: "Attorney review letter", phase: "DUE_DILIGENCE", status: "VERIFIED", signatories: [attorneyParty.id], signedAt: new Date("2026-03-15") },
      { transactionId: tx.id, name: "Mortgage pre-approval", phase: "UNDERWRITING", status: "VERIFIED", signatories: [lenderParty.id], signedAt: new Date("2026-04-08") },
      { transactionId: tx.id, name: "Appraisal report", phase: "UNDERWRITING", status: "SUBMITTED", signatories: [lenderParty.id], signedAt: new Date("2026-04-12") },
      { transactionId: tx.id, name: "Closing disclosure", phase: "CLOSING", status: "PENDING", signatories: [] },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      { transactionId: tx.id, userId: adminUser.id, action: "TRANSACTION_CREATED", metadata: { propertyAddress: "742 Maple Drive" } },
      { transactionId: tx.id, userId: adminUser.id, action: "WIRE_FRAUD_DETECTED", metadata: { fromEmail: "jwalsh@keyst0netitle.com" } },
      { transactionId: tx.id, userId: adminUser.id, action: "PHISHING_DETECTED", metadata: { fromEmail: "mtorres@njpremeir.com" } },
    ],
  });

  console.log(`Seeded: 1 org, ${8} users, 1 transaction, ${7} parties, 4 wires, ${events.length} events, 3 risk events, 3 alerts, 9 documents, 3 audit logs`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
