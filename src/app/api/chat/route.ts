import { NextResponse } from "next/server";
import { sendAIPrompt } from "~/server/agent/agent";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await sendAIPrompt(body.prompt);

    return NextResponse.json({
      success: true,
      message: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Agent failed",
      },
      { status: 500 },
    );
  }
}