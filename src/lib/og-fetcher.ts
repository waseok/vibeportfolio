export async function fetchOgImage(url: string): Promise<string> {
  // thum.io: API 키 없이 웹사이트 스크린샷을 제공하는 무료 서비스
  // 브라우저가 직접 이미지를 요청하므로 서버 부하 없음
  return `https://image.thum.io/get/width/1280/crop/720/noanimate/${encodeURIComponent(url)}`;
}
