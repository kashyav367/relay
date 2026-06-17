import { NextResponse } from "next/server";
import { setupCorsair } from "corsair";
import { corsair } from "~/server/corsair";
import { getCurrentUser } from "~/server/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  await setupCorsair(corsair, {
    tenantId: user.id,
  });

  return NextResponse.json({
    success: true,
    tenantId: user.id,
  });
}