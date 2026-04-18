export function getScreenshotUrl(url: string): string {
  return `https://s0.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1280&h=720`;
}

export async function fetchOgImage(url: string): Promise<string> {
  return getScreenshotUrl(url);
}
