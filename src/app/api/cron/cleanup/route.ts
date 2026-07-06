import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Vercel Cron: Runs every 6 hours
// Cleans up old notifications (90 days) and expired sessions
export async function GET() {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { count } = await db.notification.deleteMany({
    where: { createdAt: { lt: ninetyDaysAgo } },
  });

  return NextResponse.json({
    success: true,
    cleaned: { notifications: count },
    timestamp: new Date().toISOString(),
  });
}
