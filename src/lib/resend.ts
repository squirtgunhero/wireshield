const MOCK = process.env.MOCK_INTEGRATIONS === "true" || !process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@wireshield.io";

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

interface SendResult {
  id: string;
  status: string;
}

export async function sendEmail(payload: EmailPayload): Promise<SendResult> {
  if (MOCK) {
    console.log(`[MOCK EMAIL] To: ${Array.isArray(payload.to) ? payload.to.join(", ") : payload.to} | Subject: ${payload.subject}`);
    return { id: `email_mock_${Date.now()}`, status: "sent" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: Array.isArray(payload.to) ? payload.to : [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: payload.replyTo,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? `Resend error ${res.status}`);
  }

  const data = await res.json();
  return { id: data.id, status: "sent" };
}

export async function sendInvitation(email: string, inviterName: string, txAddress: string, inviteUrl: string) {
  return sendEmail({
    to: email,
    subject: `You've been invited to a secure transaction on WireShield`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0A2540;">You've been invited to a secure transaction</h2>
        <p style="color: #425466;">${inviterName} has invited you to join a transaction for <strong>${txAddress}</strong> on WireShield.</p>
        <a href="${inviteUrl}" style="display: inline-block; background: #00A67E; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Accept Invitation</a>
        <p style="color: #8898AA; font-size: 12px; margin-top: 24px;">WireShield — Secure real estate transactions</p>
      </div>
    `,
  });
}

export async function sendRiskAlert(email: string, alertTitle: string, txAddress: string, dashboardUrl: string) {
  return sendEmail({
    to: email,
    subject: `[WireShield Alert] ${alertTitle}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #FEF2F2; border-left: 4px solid #EF4444; padding: 16px; border-radius: 0 8px 8px 0;">
          <h3 style="color: #DC2626; margin: 0;">${alertTitle}</h3>
          <p style="color: #425466; margin-top: 8px;">A security alert has been triggered for the transaction at <strong>${txAddress}</strong>.</p>
        </div>
        <a href="${dashboardUrl}" style="display: inline-block; background: #0A2540; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Review Alert</a>
        <p style="color: #8898AA; font-size: 12px; margin-top: 24px;">Do NOT respond to any suspicious communications until this alert is resolved.</p>
      </div>
    `,
  });
}

export async function sendWireDeliveryEmail(email: string, recipientName: string, viewUrl: string) {
  return sendEmail({
    to: email,
    subject: "Secure wire instructions are ready for review",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0A2540;">Secure Wire Instructions</h2>
        <p style="color: #425466;">Hi ${recipientName},</p>
        <p style="color: #425466;">Verified wire instructions have been securely delivered to you. Click below to view them.</p>
        <a href="${viewUrl}" style="display: inline-block; background: #00A67E; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">View Wire Instructions</a>
        <div style="background: #FFF7ED; border: 1px solid #FDBA74; padding: 12px; border-radius: 8px; margin-top: 24px;">
          <p style="color: #9A3412; font-size: 13px; margin: 0;"><strong>Important:</strong> This link expires in 15 minutes. Never wire money based on instructions received via email alone. Always verify by phone.</p>
        </div>
      </div>
    `,
  });
}
