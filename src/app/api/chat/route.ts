import { NextResponse } from "next/server";
import { sendAIPrompt } from "~/server/agent/agent";
import { createCaller } from "~/server/api/root";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = String(body.prompt ?? "").toLowerCase();

    const caller = createCaller({} as any);

    // Create Meeting (must come before calendar checks)
    if (prompt.includes("create meeting")) {
      const start = new Date();
      start.setHours(start.getHours() + 1);

      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      const event = await caller.calendar.createEvent({
        summary: "AI Scheduled Meeting",
        description: "Created by Relay AI",
        start: start.toISOString(),
        end: end.toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: event,
      });
    }

    // Unread Emails
    if (prompt.includes("unread")) {
      const emails = await caller.gmail.inbox();

      const unread = emails.filter(
        (email) => email.isUnread,
      );

      return NextResponse.json({
        success: true,
        message: unread.slice(0, 10),
      });
    }

    // Gmail Inbox
    if (
      prompt.includes("email") ||
      prompt.includes("inbox")
    ) {
      const emails = await caller.gmail.inbox();

      return NextResponse.json({
        success: true,
        message: emails.slice(0, 5),
      });
    }

    // Calendar Events
    if (
      prompt.includes("calendar") ||
      prompt.includes("events")
    ) {
      const events = await caller.calendar.getEvents();

      return NextResponse.json({
        success: true,
        message: events,
      });
    }

    // Normal AI Chat
    const result = await sendAIPrompt(
      body.prompt,
      body.tenantId ?? "dev",
    );

    return NextResponse.json({
      success: true,
      message: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Agent failed",
      },
      { status: 500 },
    );
  }
}