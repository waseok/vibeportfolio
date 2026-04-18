"use client";

import { useState } from "react";
import { Comment } from "@/types";
import CommentItem from "./comment-item";
import CommentForm from "./comment-form";
import { MessageSquare } from "lucide-react";

interface CommentListProps {
  appId: number;
  initialComments: Comment[];
}

export default function CommentList({ appId, initialComments }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  function handleCommentAdded(comment: Comment) {
    setComments((prev) => [...prev, comment]);
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-slate-600" />
        <h2 className="text-base font-semibold text-slate-900">
          피드백 <span className="text-slate-500 font-normal">({comments.length})</span>
        </h2>
      </div>

      {/* Comments list */}
      <div className="bg-white border border-slate-200 rounded-lg mb-6">
        {comments.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">아직 피드백이 없습니다. 첫 번째 피드백을 남겨보세요!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 px-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>

      {/* Comment form */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">피드백 작성</h3>
        <CommentForm appId={appId} onCommentAdded={handleCommentAdded} />
      </div>
    </div>
  );
}
