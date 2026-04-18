import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appId = parseInt(id);

  const app = await prisma.app.findUnique({
    where: { id: appId },
    include: { _count: { select: { comments: true } } },
  });

  if (!app || !app.approved) {
    return NextResponse.json({ error: "앱을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({
    ...app,
    tags: JSON.parse(app.tags) as string[],
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  });
}

// Increment click count
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appId = parseInt(id);

  await prisma.app.update({
    where: { id: appId },
    data: { clickCount: { increment: 1 } },
  });

  return NextResponse.json({ ok: true });
}
