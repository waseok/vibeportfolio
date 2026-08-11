import { NextRequest, NextResponse } from "next/server";
import { fetchOgImage } from "@/lib/og-fetcher";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url 파라미터가 필요합니다." }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "올바른 URL이 아닙니다." }, { status: 400 });
  }

  const thumbnailUrl = await fetchOgImage(url);

  return NextResponse.json(
    { thumbnailUrl },
    { headers: { "Cache-Control": "public, max-age=86400" } }
  );
}
