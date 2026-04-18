"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Eye, ExternalLink } from "lucide-react";
import { AppItem } from "@/types";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/lib/constants";
import { getScreenshotUrl } from "@/lib/og-fetcher";

interface AppCardProps {
  app: AppItem;
}

export default function AppCard({ app }: AppCardProps) {
  const badgeColor = CATEGORY_COLORS[app.category] || CATEGORY_COLORS["기타"];

  async function handleClick() {
    // Fire-and-forget click count increment
    fetch(`/api/apps/${app.id}`, { method: "POST" }).catch(() => {});
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col">
      <Link
        href={`/apps/${app.id}`}
        className="block flex-1"
        onClick={handleClick}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-slate-100 overflow-hidden">
          <Image
            src={getScreenshotUrl(app.url)}
            alt={app.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 flex-1">
              {app.title}
            </h3>
            <span
              className={cn(
                "flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full",
                badgeColor
              )}
            >
              {app.category}
            </span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {app.description}
          </p>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {app.clickCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {app._count?.comments ?? 0}
              </span>
            </div>
            <span className="text-slate-400">{app.submitterName}</span>
          </div>
        </div>
      </Link>

      {/* External link button */}
      <div className="px-4 pb-3">
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
