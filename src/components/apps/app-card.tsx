"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Eye, ExternalLink } from "lucide-react";
import { AppItem } from "@/types";
import { cn, getInitials } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_GRADIENTS, CATEGORY_BORDER_COLORS } from "@/lib/constants";
import { getScreenshotUrl } from "@/lib/og-fetcher";

interface AppCardProps {
  app: AppItem;
}

export default function AppCard({ app }: AppCardProps) {
  const [screenshotLoaded, setScreenshotLoaded] = useState(false);
  const [screenshotError, setScreenshotError] = useState(false);
  const gradient = CATEGORY_GRADIENTS[app.category] || CATEGORY_GRADIENTS["기타"];
  const badgeColor = CATEGORY_COLORS[app.category] || CATEGORY_COLORS["기타"];
  const borderColor = CATEGORY_BORDER_COLORS[app.category] || CATEGORY_BORDER_COLORS["기타"];

  function handleClick() {
    fetch(`/api/apps/${app.id}`, { method: "POST" }).catch(() => {});
  }

  return (
    <div className={cn(
      "bg-white border border-slate-200 border-t-4 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col",
      borderColor
    )}>
      <Link href={`/apps/${app.id}`} className="block flex-1" onClick={handleClick}>
        {/* 제목 영역 */}
        <div className="px-4 py-3 flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 flex-1">
            {app.title}
          </h3>
          <span className={cn("flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full mt-0.5", badgeColor)}>
            {app.category}
          </span>
        </div>

        {/* 썸네일 */}
        <div className="relative aspect-video overflow-hidden">
          <div className={cn("absolute inset-0 bg-gradient-to-br flex items-center justify-center", gradient)}>
            <span className="text-white text-2xl font-bold opacity-80">
              {getInitials(app.title)}
            </span>
          </div>
          {!screenshotError && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getScreenshotUrl(app.url)}
              alt={app.title}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                screenshotLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setScreenshotLoaded(true)}
              onError={() => setScreenshotError(true)}
            />
          )}
        </div>

        {/* 설명 + 통계 */}
        <div className="px-4 py-3">
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">{app.description}</p>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {app.clickCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {app._count?.comments ?? 0}
            </span>
            <span className="ml-auto">{app.submitterName}</span>
          </div>
        </div>
      </Link>

      {/* 바로 열기 버튼 */}
      <div className="px-4 pb-4">
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          바로 열기
        </a>
      </div>
    </div>
  );
}
