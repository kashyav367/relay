import { NextResponse } from "next/server";
import { createCaller } from "~/server/api/root";

export async function GET() {
  try {
    const caller = createCaller({} as any);

    const emails =
      await caller.gmail.inbox();

    return NextResponse.json(
      emails.slice(0, 5),
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 },
    );
  }
}