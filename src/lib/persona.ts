const MOCK = process.env.MOCK_INTEGRATIONS === "true" || !process.env.PERSONA_API_KEY;

export interface PersonaVerification {
  inquiryId: string;
  status: "created" | "pending" | "completed" | "failed" | "expired";
  referenceId: string;
  checks: {
    selfie: boolean;
    governmentId: boolean;
    liveness: boolean;
  };
  confidenceScore: number;
  completedAt?: string;
}

export async function createInquiry(userId: string, templateId?: string): Promise<{ inquiryId: string; sessionToken: string }> {
  if (MOCK) {
    return {
      inquiryId: `inq_mock_${Date.now()}`,
      sessionToken: `sess_mock_${Date.now()}`,
    };
  }

  const res = await fetch("https://withpersona.com/api/v1/inquiries", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PERSONA_API_KEY}`,
      "Content-Type": "application/json",
      "Persona-Version": "2023-01-05",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          "inquiry-template-id": templateId || process.env.PERSONA_TEMPLATE_ID,
          "reference-id": userId,
        },
      },
    }),
  });

  const data = await res.json();
  return {
    inquiryId: data.data.id,
    sessionToken: data.meta?.session_token ?? "",
  };
}

export async function getVerificationStatus(inquiryId: string): Promise<PersonaVerification> {
  if (MOCK) {
    return {
      inquiryId,
      status: "completed",
      referenceId: "mock-user",
      checks: { selfie: true, governmentId: true, liveness: true },
      confidenceScore: 98.5,
      completedAt: new Date().toISOString(),
    };
  }

  const res = await fetch(`https://withpersona.com/api/v1/inquiries/${inquiryId}`, {
    headers: {
      Authorization: `Bearer ${process.env.PERSONA_API_KEY}`,
      "Persona-Version": "2023-01-05",
    },
  });

  const data = await res.json();
  const attrs = data.data.attributes;
  const checks = data.included?.filter((i: { type: string }) => i.type === "verification") ?? [];

  return {
    inquiryId,
    status: attrs.status,
    referenceId: attrs["reference-id"],
    checks: {
      selfie: checks.some((c: { attributes: { status: string; "verification-type": string } }) => c.attributes["verification-type"] === "selfie" && c.attributes.status === "passed"),
      governmentId: checks.some((c: { attributes: { status: string; "verification-type": string } }) => c.attributes["verification-type"] === "government-id" && c.attributes.status === "passed"),
      liveness: checks.some((c: { attributes: { status: string; "verification-type": string } }) => c.attributes["verification-type"] === "selfie-liveness" && c.attributes.status === "passed"),
    },
    confidenceScore: parseFloat(attrs["confidence-score"] ?? "0"),
    completedAt: attrs["completed-at"],
  };
}

export function parseWebhookEvent(payload: Record<string, unknown>) {
  const data = payload.data as Record<string, unknown>;
  const attrs = (data.attributes ?? {}) as Record<string, string>;
  return {
    eventType: attrs.name,
    inquiryId: (data.relationships as Record<string, { data?: { id: string } }>)?.inquiry?.data?.id,
    status: attrs.status,
  };
}
