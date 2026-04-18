export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    // Use microlink API for reliable screenshot/OG image extraction
    const res = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=true`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (
      data?.data?.image?.url ||
      data?.data?.screenshot?.url ||
      null
    );
  } catch {
    return null;
  }
}
