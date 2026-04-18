import { Comment } from "@/types";
import { formatRelativeDate } from "@/lib/utils";
import { User } from "lucide-react";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex gap-3 py-4 border-b border-slate-100 last:border-0">
      <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
        <User className="w-4 h-4 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-slate-800">{comment.authorName}</span>
          <span className="text-xs text-slate-400">{formatRelativeDate(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}
