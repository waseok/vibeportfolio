import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedApps = [
  {
    title: "NEIS 나이스 대국민서비스",
    description: "교육행정정보시스템(NEIS)으로 학생 성적 관리, 생활기록부 작성, 출결 처리 등 학교 행정 전반을 처리하는 핵심 업무 시스템입니다.",
    url: "https://www.neis.go.kr",
    category: "행정",
    tags: ["성적", "생기부", "출결", "필수"],
    submitterName: "관리자",
    clickCount: 120,
  },
  {
    title: "에듀파인",
    description: "학교 예산 편성, 지출 품의, 세입세출 결산 등 학교 재정 업무를 처리하는 교육재정시스템입니다.",
    url: "https://www.edufine.go.kr",
    category: "행정",
    tags: ["예산", "회계", "재정"],
    submitterName: "관리자",
    clickCount: 85,
  },
  {
    title: "e학습터",
    description: "교육부에서 운영하는 초중등 온라인 학습 플랫폼으로 다양한 디지털 학습 콘텐츠와 온라인 수업 도구를 제공합니다.",
    url: "https://cls.edunet.net",
    category: "수업",
    tags: ["온라인수업", "학습콘텐츠", "플랫폼"],
    submitterName: "관리자",
    clickCount: 200,
  },
];

async function main() {
  console.log("시드 데이터 입력 시작...");
  for (const app of seedApps) {
    await prisma.app.create({ data: app });
  }
  console.log(`✅ ${seedApps.length}개의 앱이 등록되었습니다.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
