"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ShareButtonProps {
  url: string;
  title: string;
}

export default function ShareButton({ url, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("URL이 복사되었습니다!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("URL 복사에 실패했습니다.");
    }
  }

  return (
    <button
      onClick={handleShare}
      title={`${title} URL 복사`}
      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
    >
      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
      공유
    </button>
  );
}
