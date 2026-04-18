import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAppSchema } from "@/lib/validations";
import { fetchOgImage } from "@/lib/og-fetcher";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 20;

  const where = {
    approved: true,
    ...(search && {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
      ],
    }),
    ...(category && category !== "전체" && { category }),
  };

  const orderBy =
    sort === "most_visited"
      ? { clickCount: "desc" as const }
      : sort === "most_comments"
      ? { comments: { _count: "desc" as const } }
      : { createdAt: "desc" as const };

  const [apps, total] = await Promise.all([
    prisma.app.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { _count: { select: { comments: true } } },
    }),
    prisma.app.count({ where }),
  ]);

  const serialized = apps.map((app) => ({
    ...app,
    tags: JSON.parse(app.tags) as string[],
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  }));

  return NextResponse.json({ apps: serialized, total, page, pageSize });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createAppSchema.parse(body);

    const thumbnailUrl = await fetchOgImage(data.url);

    const app = await prisma.app.create({
      data: {
        title: data.title,
        description: data.description,
        url: data.url,
        thumbnailUrl,
        category: data.category,
        tags: JSON.stringify(data.tags),
        submitterName: data.submitterName || "익명",
      },
      include: { _count: { select: { comments: true } } },
    });

    return NextResponse.json(
      {
        ...app,
        tags: JSON.parse(app.tags) as string[],
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
      },
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
