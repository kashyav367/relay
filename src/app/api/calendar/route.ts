import { NextResponse } from "next/server";
import { createCaller } from "~/server/api/root";

export async function GET() {
  try {
    const caller = createCaller({} as any);

    const events =
      await caller.calendar.getEvents();

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}