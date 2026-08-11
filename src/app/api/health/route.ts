import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Supabase 무료 티어는 약 7일 무접속 시 프로젝트가 일시정지됩니다.
 * Vercel Cron(vercel.json)이 이 엔드포인트를 주기적으로 호출해
 * DB에 SELECT 1을 날려 keep-alive 합니다.
 */
export async function GET(request: NextRequest) {
  // CRON_SECRET 이 설정된 경우, Vercel Cron / 수동 호출만 허용
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      db: "up",
      time: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown DB error";
    console.error("[health] DB ping failed:", message);
    return NextResponse.json(
      {
        ok: false,
        db: "down",
        error: message,
        time: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
