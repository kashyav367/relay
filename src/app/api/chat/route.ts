

import { NextResponse } from "next/server";
import { createCaller } from "~/server/api/root";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = String(body.prompt ?? "").trim();

    if (!prompt) {
      return NextResponse.json({ success: false, error: "No prompt" }, { status: 400 });
    }

    const caller = createCaller({} as any);
    const result = await caller.ai.chat({
      prompt,
      useLocalModel: false,
    });

    return NextResponse.json({ success: true, message: result.response });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Agent failed",
      },
      { status: 500 },
    );
  }
}