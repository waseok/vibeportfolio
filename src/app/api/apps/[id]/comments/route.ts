import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createCommentSchema } from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appId = parseInt(id);

  const comments = await prisma.comment.findMany({
    where: { appId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    comments.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appId = parseInt(id);
    const body = await request.json();
    const data = createCommentSchema.parse(body);

    const app = await prisma.app.findUnique({ where: { id: appId } });
    if (!app) {
      return NextResponse.json({ error: "앱을 찾을 수 없습니다." }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        appId,
        authorName: data.authorName || "익명",
        content: data.content,
      },
    });

    return NextResponse.json(
      { ...comment, createdAt: comment.createdAt.toISOString() },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "입력 데이터가 올바르지 않습니다." }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
