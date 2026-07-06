import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// GET /api/notifications — Get user's notifications
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const [notifications, total, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.notification.count({ where: { userId: user.id } }),
    db.notification.count({ where: { userId: user.id, isRead: false } }),
  ]);

  return NextResponse.json({
    success: true,
    data: notifications,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit), unreadCount },
  });
}

// PATCH /api/notifications — Mark notifications as read
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids, markAll } = await request.json();

  if (markAll) {
    await db.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  } else if (ids && ids.length > 0) {
    await db.notification.updateMany({
      where: { id: { in: ids }, userId: user.id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  return NextResponse.json({ success: true });
}
