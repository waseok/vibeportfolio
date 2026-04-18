import ogs from "open-graph-scraper";

export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const { result, error } = await ogs({
      url,
      timeout: 5000,
      fetchOptions: {
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        },
      },
    });

    if (error || !result.success) return null;

    const ogImage = result.ogImage?.[0]?.url;
    const twitterImage = result.twitterImage?.[0]?.url;
    const rawImage = ogImage || twitterImage;

    if (!rawImage) return null;

    // Resolve relative URLs
    if (rawImage.startsWith("http")) return rawImage;
    const origin = new URL(url).origin;
    return `${origin}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;
  } catch {
    return null;
  }
}
