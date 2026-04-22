const MOCK = process.env.MOCK_INTEGRATIONS === "true" || !process.env.TWILIO_ACCOUNT_SID;

const TWILIO_BASE = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}`;

async function twilioRequest(endpoint: string, body: Record<string, string>) {
  const res = await fetch(`${TWILIO_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? `Twilio error ${res.status}`);
  }
  return res.json();
}

export interface SmsResult {
  sid: string;
  status: string;
  to: string;
}

export async function sendSms(to: string, body: string): Promise<SmsResult> {
  if (MOCK) {
    console.log(`[MOCK SMS] To: ${to} | Body: ${body}`);
    return { sid: `SM_mock_${Date.now()}`, status: "sent", to };
  }

  const data = await twilioRequest("/Messages.json", {
    To: to,
    From: process.env.TWILIO_PHONE_NUMBER!,
    Body: body,
  });

  return { sid: data.sid, status: data.status, to: data.to };
}

export async function sendOtp(to: string): Promise<{ sid: string }> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const result = await sendSms(to, `Your WireShield verification code is: ${code}. It expires in 10 minutes.`);
  return { sid: result.sid };
}

export async function sendTransactionAlert(to: string, txAddress: string, alertType: string): Promise<SmsResult> {
  return sendSms(to, `WireShield Alert: ${alertType} detected on transaction for ${txAddress}. Log in to review immediately.`);
}

export async function sendWireDeliveryNotification(to: string, recipientName: string, viewUrl: string): Promise<SmsResult> {
  return sendSms(to, `Hi ${recipientName}, secure wire instructions are ready for your review. View them here: ${viewUrl} (expires in 15 minutes)`);
}
