import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminActionSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, action, targetId } = adminActionSchema.parse(body);

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    if (action === "delete_app") {
      await prisma.app.delete({ where: { id: targetId } });
      return NextResponse.json({ ok: true, message: "앱이 삭제되었습니다." });
    }

    if (action === "delete_comment") {
      await prisma.comment.delete({ where: { id: targetId } });
      return NextResponse.json({ ok: true, message: "피드백이 삭제되었습니다." });
    }

    if (action === "toggle_approve") {
      const app = await prisma.app.findUnique({ where: { id: targetId } });
      if (!app) return NextResponse.json({ error: "앱을 찾을 수 없습니다." }, { status: 404 });
      const updated = await prisma.app.update({
        where: { id: targetId },
        data: { approved: !app.approved },
      });
      return NextResponse.json({ ok: true, approved: updated.approved });
    }

    return NextResponse.json({ error: "알 수 없는 액션입니다." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
