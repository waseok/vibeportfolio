"use client";

import { useState, useRef, useEffect } from "react";
import { X, Link as LinkIcon, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import { createAppSchema } from "@/lib/validations";
import { CATEGORIES } from "@/lib/constants";
import { AppItem } from "@/types";
import toast from "react-hot-toast";

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (app: AppItem) => void;
  initialData?: AppItem; // 수정 모드
}

export default function AddAppModal({ isOpen, onClose, onSuccess, initialData }: AddAppModalProps) {
  const isEditMode = !!initialData;

  const [form, setForm] = useState({
    title: "",
    description: "",
    url: "",
    category: "기타",
    tags: "",
    submitterName: "",
  });
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [fetchingThumb, setFetchingThumb] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          title: initialData.title,
          description: initialData.description,
          url: initialData.url,
          category: initialData.category,
          tags: initialData.tags.join(", "),
          submitterName: initialData.submitterName,
        });
        setThumbnailUrl(initialData.thumbnailUrl);
      } else {
        setForm({ title: "", description: "", url: "", category: "기타", tags: "", submitterName: "" });
        setThumbnailUrl(null);
      }
      setErrors({});
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, initialData]);

  async function fetchThumbnail(url: string) {
    if (!url) return;
    try { new URL(url); } catch { return; }
    setFetchingThumb(true);
    try {
      const res = await fetch(`/api/thumbnail?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      setThumbnailUrl(data.thumbnailUrl);
    } catch {
      setThumbnailUrl(null);
    } finally {
      setFetchingThumb(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const result = createAppSchema.safeParse({ ...form, tags });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) errs[String(err.path[0])] = err.message;
      });
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const url = isEditMode ? `/api/apps/${initialData!.id}` : "/api/apps";
      const method = isEditMode ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error("요청 실패");
      const app: AppItem = await res.json();
      toast.success(isEditMode ? "수정되었습니다!" : "앱이 등록되었습니다!");
      onSuccess(app);
    } catch {
      toast.error(isEditMode ? "수정 중 오류가 발생했습니다." : "등록 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">
            {isEditMode ? "앱 수정" : "새 앱 등록"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              앱 URL <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                onBlur={(e) => fetchThumbnail(e.target.value)}
                placeholder="https://example.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.url && <p className="text-xs text-red-500 mt-1">{errors.url}</p>}
            {(fetchingThumb || thumbnailUrl !== undefined) && (
              <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 aspect-video relative bg-slate-100">
                {fetchingThumb ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  </div>
                ) : thumbnailUrl ? (
                  <Image src={thumbnailUrl} alt="미리보기" fill className="object-cover" unoptimized />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span className="text-xs">썸네일 없음</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              앱 이름 <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstInputRef}
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="앱 이름을 입력하세요"
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              설명 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="어떤 업무에 활용하는 앱인지 간략히 설명해주세요"
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Category + Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">카테고리</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {CATEGORIES.filter((c) => c !== "전체").map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">태그</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="쉼표로 구분"
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submitter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              이름 <span className="text-slate-400 font-normal">(선택)</span>
            </label>
            <input
              type="text"
              value={form.submitterName}
              onChange={(e) => setForm({ ...form, submitterName: e.target.value })}
              placeholder="익명"
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              취소
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-60 rounded-lg transition-colors flex items-center justify-center gap-2">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />{isEditMode ? "수정 중..." : "등록 중..."}</> : isEditMode ? "수정하기" : "등록하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
