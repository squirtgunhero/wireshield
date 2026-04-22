import { prisma } from "@/lib/db";
import { sendSms } from "@/lib/twilio";
import { sendEmail } from "@/lib/resend";
import type { NotificationChannel } from "@prisma/client";

interface NotificationPayload {
  userId: string;
  transactionId?: string;
  type: string;
  title: string;
  body: string;
  channels: NotificationChannel[];
  recipientEmail?: string;
  recipientPhone?: string;
}

export async function createNotification(payload: NotificationPayload) {
  const results = [];

  for (const channel of payload.channels) {
    const notification = await prisma.notification.create({
      data: {
        userId: payload.userId,
        transactionId: payload.transactionId || null,
        channel,
        type: payload.type,
        title: payload.title,
        body: payload.body,
      },
    });

    try {
      switch (channel) {
        case "EMAIL":
          if (payload.recipientEmail) {
            await sendEmail({
              to: payload.recipientEmail,
              subject: payload.title,
              html: `<div style="font-family: Inter, sans-serif;"><h3 style="color: #0A2540;">${payload.title}</h3><p style="color: #425466;">${payload.body}</p></div>`,
            });
            await prisma.notification.update({
              where: { id: notification.id },
              data: { sentAt: new Date() },
            });
          }
          break;
        case "SMS":
          if (payload.recipientPhone) {
            await sendSms(payload.recipientPhone, `${payload.title}: ${payload.body}`);
            await prisma.notification.update({
              where: { id: notification.id },
              data: { sentAt: new Date() },
            });
          }
          break;
        case "IN_APP":
          await prisma.notification.update({
            where: { id: notification.id },
            data: { sentAt: new Date() },
          });
          break;
        case "PUSH":
          break;
      }
    } catch (e) {
      console.error(`Failed to send ${channel} notification:`, e);
    }

    results.push(notification);
  }

  return results;
}

export async function notifyRiskAlert(
  transactionId: string,
  alertTitle: string,
  alertBody: string
) {
  const parties = await prisma.transactionParty.findMany({
    where: { transactionId, status: "VERIFIED", userId: { not: null } },
    include: { user: { select: { id: true, email: true, phone: true } } },
  });

  for (const party of parties) {
    if (!party.user) continue;
    await createNotification({
      userId: party.user.id,
      transactionId,
      type: "RISK_ALERT",
      title: alertTitle,
      body: alertBody,
      channels: ["IN_APP", "EMAIL"],
      recipientEmail: party.user.email,
      recipientPhone: party.user.phone ?? undefined,
    });
  }
}

export async function notifyPartyInvited(
  transactionId: string,
  partyName: string,
  partyEmail: string,
  inviterName: string
) {
  const user = await prisma.user.findUnique({ where: { email: partyEmail } });
  if (!user) return;

  await createNotification({
    userId: user.id,
    transactionId,
    type: "PARTY_INVITATION",
    title: "Transaction invitation",
    body: `${inviterName} has invited you to join a transaction on WireShield.`,
    channels: ["IN_APP", "EMAIL"],
    recipientEmail: partyEmail,
  });
}
