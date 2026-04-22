import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getVerificationStatus, parseWebhookEvent } from "@/lib/persona";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const event = parseWebhookEvent(payload);

    if (!event.inquiryId) {
      return NextResponse.json({ received: true });
    }

    const verification = await getVerificationStatus(event.inquiryId);

    if (verification.status === "completed" && verification.referenceId) {
      await prisma.user.updateMany({
        where: { id: verification.referenceId },
        data: {
          identityVerified: true,
          identityVerifiedAt: new Date(),
          identityProvider: "persona",
          identityConfidenceScore: verification.confidenceScore,
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Persona webhook error:", e);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
