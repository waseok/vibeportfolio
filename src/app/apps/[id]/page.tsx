import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate, getDomain, cn } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_GRADIENTS } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import CommentList from "@/components/comments/comment-list";
import { Comment } from "@/types";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Calendar,
  User,
  Tag,
} from "lucide-react";
import ShareButton from "@/components/apps/share-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AppDetailPage({ params }: PageProps) {
  const { id } = await params;
  const appId = parseInt(id);

  if (isNaN(appId)) notFound();

  const app = await prisma.app.findUnique({
    where: { id: appId, approved: true },
    include: { comments: { orderBy: { createdAt: "asc" } } },
  });

  if (!app) notFound();

  const tags: string[] = app.tags;
  const gradient = CATEGORY_GRADIENTS[app.category] || CATEGORY_GRADIENTS["기타"];
  const badgeColor = CATEGORY_COLORS[app.category] || CATEGORY_COLORS["기타"];
  const comments: Comment[] = app.comments.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <span className="text-sm text-slate-600 font-medium truncate">{app.title}</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-slate-100">
            {app.thumbnailUrl ? (
              <Image
                src={app.thumbnailUrl}
                alt={app.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            ) : (
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br flex items-center justify-center",
                  gradient
                )}
              >
                <span className="text-white text-4xl font-bold opacity-80">
                  {getInitials(app.title)}
                </span>
              </div>
            )}
          </div>

          {/* App info */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-xl font-bold text-slate-900 leading-snug">{app.title}</h1>
              <span
                className={cn(
                  "flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full",
                  badgeColor
                )}
              >
                {app.category}
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">{app.description}</p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-5 pt-4 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                조회 {app.clickCount.toLocaleString()}회
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {app.submitterName}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(app.createdAt)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {getDomain(app.url)} 열기
              </a>
              <ShareButton url={app.url} title={app.title} />
            </div>
          </div>
        </div>

        {/* Comments */}
        <CommentList appId={app.id} initialComments={comments} />
      </main>
    </div>
  );
}
