import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Vercel Cron이 매일 호출 — Supabase 7일 휴면 방지
export async function GET() {
  await prisma.app.count();
  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}
