import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "..", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

const seedApps = [
  {
    title: "NEIS 나이스 대국민서비스",
    description: "교육행정정보시스템(NEIS)으로 학생 성적 관리, 생활기록부 작성, 출결 처리 등 학교 행정 전반을 처리하는 핵심 업무 시스템입니다.",
    url: "https://www.neis.go.kr",
    category: "행정",
    tags: JSON.stringify(["성적", "생기부", "출결", "필수"]),
    submitterName: "관리자",
    clickCount: 120,
  },
  {
    title: "에듀파인",
    description: "학교 예산 편성, 지출 품의, 세입세출 결산 등 학교 재정 업무를 처리하는 교육재정시스템입니다.",
    url: "https://www.edufine.go.kr",
    category: "행정",
    tags: JSON.stringify(["예산", "회계", "재정"]),
    submitterName: "관리자",
    clickCount: 85,
  },
  {
    title: "e학습터",
    description: "교육부에서 운영하는 초중등 온라인 학습 플랫폼으로 다양한 디지털 학습 콘텐츠와 온라인 수업 도구를 제공합니다.",
    url: "https://cls.edunet.net",
    category: "수업",
    tags: JSON.stringify(["온라인수업", "학습콘텐츠", "플랫폼"]),
    submitterName: "관리자",
    clickCount: 200,
  },
  {
    title: "EBS 온라인클래스",
    description: "EBS에서 제공하는 온라인 수업 플랫폼으로 실시간 화상 수업, 강의 영상 공유, 과제 제출 기능을 지원합니다.",
    url: "https://oc.ebssw.kr",
    category: "수업",
    tags: JSON.stringify(["온라인수업", "EBS", "화상수업"]),
    submitterName: "관리자",
    clickCount: 156,
  },
  {
    title: "클래스팅",
    description: "학급 전용 SNS 플랫폼으로 가정통신문 발송, 알림장 관리, 학부모와의 소통을 한 곳에서 관리할 수 있습니다.",
    url: "https://www.classting.com",
    category: "소통",
    tags: JSON.stringify(["학부모소통", "가정통신문", "알림장"]),
    submitterName: "관리자",
    clickCount: 175,
  },
  {
    title: "구글 클래스룸",
    description: "구글에서 제공하는 무료 수업 관리 도구로 과제 배포, 제출, 채점, 학생 피드백을 효율적으로 관리할 수 있습니다.",
    url: "https://classroom.google.com",
    category: "수업",
    tags: JSON.stringify(["과제관리", "구글", "채점"]),
    submitterName: "선생님",
    clickCount: 230,
  },
  {
    title: "학교알리미",
    description: "학교 정보 공시 서비스로 교원 현황, 학생 수, 학교 운영 계획 등 학교 공시 자료를 관리하고 제출하는 공식 플랫폼입니다.",
    url: "https://www.schoolinfo.go.kr",
    category: "행정",
    tags: JSON.stringify(["공시", "정보공개", "필수"]),
    submitterName: "관리자",
    clickCount: 67,
  },
  {
    title: "Canva 교육용",
    description: "드래그 앤 드롭으로 쉽게 교육 자료를 만들 수 있는 디자인 툴로 수업 자료, 포스터, 프레젠테이션 제작에 활용됩니다.",
    url: "https://www.canva.com/ko_kr/education",
    category: "수업",
    tags: JSON.stringify(["디자인", "수업자료", "프레젠테이션"]),
    submitterName: "선생님",
    clickCount: 143,
  },
  {
    title: "패들렛 (Padlet)",
    description: "디지털 게시판 협업 도구로 학생들의 의견 수집, 모둠 활동 결과 공유, 브레인스토밍 수업에 효과적으로 활용됩니다.",
    url: "https://padlet.com",
    category: "수업",
    tags: JSON.stringify(["협업", "모둠활동", "토론"]),
    submitterName: "선생님",
    clickCount: 98,
  },
  {
    title: "국가교육과정정보센터(NCIC)",
    description: "교육과정 원문, 성취기준, 교수학습자료 등 교육과정 관련 자료를 종합적으로 제공하는 공식 교육과정 정보 플랫폼입니다.",
    url: "https://www.ncic.go.kr",
    category: "수업",
    tags: JSON.stringify(["교육과정", "성취기준", "교수학습"]),
    submitterName: "관리자",
    clickCount: 54,
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
