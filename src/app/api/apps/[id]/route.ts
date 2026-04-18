import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAppSchema } from "@/lib/validations";
import { fetchOgImage } from "@/lib/og-fetcher";

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

// Edit app
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appId = parseInt(id);
    const body = await request.json();
    const data = createAppSchema.parse(body);

    const existing = await prisma.app.findUnique({ where: { id: appId } });
    if (!existing) {
      return NextResponse.json({ error: "앱을 찾을 수 없습니다." }, { status: 404 });
    }

    // Re-fetch thumbnail only if URL changed
    const thumbnailUrl =
      existing.url !== data.url
        ? await fetchOgImage(data.url)
        : existing.thumbnailUrl;

    const app = await prisma.app.update({
      where: { id: appId },
      data: {
        title: data.title,
        description: data.description,
        url: data.url,
        thumbnailUrl,
        category: data.category,
        tags: data.tags,
        submitterName: data.submitterName || "익명",
      },
      include: { _count: { select: { comments: true } } },
    });

    return NextResponse.json({
      ...app,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[PATCH /api/apps/[id]] error:", message);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
