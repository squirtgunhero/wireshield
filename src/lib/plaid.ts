const MOCK = process.env.MOCK_INTEGRATIONS === "true" || !process.env.PLAID_CLIENT_ID;

const PLAID_ENV = process.env.PLAID_ENV ?? "sandbox";
const PLAID_BASE = PLAID_ENV === "production"
  ? "https://production.plaid.com"
  : PLAID_ENV === "development"
    ? "https://development.plaid.com"
    : "https://sandbox.plaid.com";

async function plaidRequest(endpoint: string, body: Record<string, unknown>) {
  const res = await fetch(`${PLAID_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      ...body,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error_message?: string }).error_message ?? `Plaid error ${res.status}`);
  }
  return res.json();
}

export interface PlaidLinkResult {
  linkToken: string;
  expiration: string;
}

export async function createLinkToken(userId: string): Promise<PlaidLinkResult> {
  if (MOCK) {
    return {
      linkToken: `link-sandbox-mock-${Date.now()}`,
      expiration: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    };
  }

  const data = await plaidRequest("/link/token/create", {
    user: { client_user_id: userId },
    client_name: "WireShield",
    products: ["auth"],
    country_codes: ["US"],
    language: "en",
  });

  return { linkToken: data.link_token, expiration: data.expiration };
}

export interface BankVerification {
  verified: boolean;
  accountId: string;
  institutionName: string;
  accountName: string;
  accountType: string;
  accountMask: string;
  routingNumber: string;
  accountAgeDays: number;
  holderName: string;
}

export async function verifyAccount(publicToken: string): Promise<BankVerification> {
  if (MOCK) {
    return {
      verified: true,
      accountId: `acct_mock_${Date.now()}`,
      institutionName: "Chase Bank",
      accountName: "Checking",
      accountType: "depository",
      accountMask: "7731",
      routingNumber: "****4829",
      accountAgeDays: 2190,
      holderName: "James Chen",
    };
  }

  const exchangeData = await plaidRequest("/item/public_token/exchange", {
    public_token: publicToken,
  });

  const accessToken = exchangeData.access_token;

  const authData = await plaidRequest("/auth/get", {
    access_token: accessToken,
  });

  const account = authData.accounts[0];
  const numbers = authData.numbers.ach[0];

  return {
    verified: true,
    accountId: account.account_id,
    institutionName: authData.item?.institution_id ?? "Unknown",
    accountName: account.name,
    accountType: account.type,
    accountMask: account.mask,
    routingNumber: numbers.routing,
    accountAgeDays: 0,
    holderName: account.official_name ?? account.name,
  };
}

export async function getAccountStatus(accessToken: string) {
  if (MOCK) {
    return { active: true, lastUpdated: new Date().toISOString() };
  }

  const data = await plaidRequest("/accounts/get", {
    access_token: accessToken,
  });

  return {
    active: true,
    lastUpdated: data.item?.consent_expiration_time ?? new Date().toISOString(),
  };
}
