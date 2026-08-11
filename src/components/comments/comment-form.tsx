"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Comment } from "@/types";
import toast from "react-hot-toast";

interface CommentFormProps {
  appId: number;
  onCommentAdded: (comment: Comment) => void;
}

export default function CommentForm({ appId, onCommentAdded }: CommentFormProps) {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/apps/${appId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: authorName.trim() || "익명", content: content.trim() }),
      });
      if (!res.ok) throw new Error();
      const comment: Comment = await res.json();
      onCommentAdded(comment);
      setContent("");
      toast.success("피드백이 등록되었습니다.");
    } catch {
      toast.error("피드백 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="이름 (선택, 기본값: 익명)"
          maxLength={50}
          className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="이 앱에 대한 피드백을 자유롭게 작성해주세요."
          rows={3}
          maxLength={1000}
          className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <div className="text-right text-xs text-slate-400 mt-1">{content.length} / 1000</div>
      </div>
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-50 rounded-lg transition-colors"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        피드백 등록
      </button>
    </form>
  );
}
