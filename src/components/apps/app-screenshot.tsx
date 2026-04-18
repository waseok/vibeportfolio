"use client";

import { useState } from "react";
import { cn, getInitials } from "@/lib/utils";
import { CATEGORY_GRADIENTS } from "@/lib/constants";
import { getScreenshotUrl } from "@/lib/og-fetcher";

interface AppScreenshotProps {
  url: string;
  title: string;
  category: string;
}

export default function AppScreenshot({ url, title, category }: AppScreenshotProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const gradient = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS["기타"];

  return (
    <div className="relative aspect-video bg-slate-100">
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br flex items-center justify-center",
          gradient
        )}
      >
        <span className="text-white text-4xl font-bold opacity-80">
          {getInitials(title)}
        </span>
      </div>
      {!error && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getScreenshotUrl(url)}
          alt={title}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
