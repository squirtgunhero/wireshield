import { NextResponse } from "next/server";
import { runLocalScan, runDomainScan, buildAiPrompt, type AnalysisRequest } from "@/lib/ai/analyzer";

export async function POST(request: Request) {
  try {
    const body: AnalysisRequest = await request.json();

    if (!body.content || typeof body.content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const localScan = runLocalScan(body.content);
    const domainAnalysis = runDomainScan(
      body.content,
      body.verifiedEmails ?? []
    );

    let aiAnalysis = undefined;

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const { default: Anthropic } = await import("@anthropic-ai/sdk");
        const client = new Anthropic();
        const prompt = buildAiPrompt(body);

        const message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        });

        const textBlock = message.content.find((b) => b.type === "text");
        if (textBlock && textBlock.type === "text") {
          try {
            aiAnalysis = JSON.parse(textBlock.text);
          } catch {
            aiAnalysis = { riskLevel: "UNKNOWN", summary: textBlock.text, flags: [], recommendation: "Review manually", fraudType: "Unknown", senderVerified: false, senderNote: "" };
          }
        }
      } catch (err) {
        console.error("AI analysis failed:", err);
      }
    }

    return NextResponse.json({
      localScan,
      domainAnalysis,
      aiAnalysis,
    });
  } catch {
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
