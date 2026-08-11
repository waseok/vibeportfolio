"use client";

import { useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import AddAppModal from "@/components/apps/add-app-modal";
import { AppItem } from "@/types";

interface HeaderProps {
  onAppAdded: (app: AppItem) => void;
}

export default function Header({ onAppAdded }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 bg-blue-800 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  와석초 학교업무효율화
                </h1>
                <p className="text-xs text-slate-500 leading-tight">플랫폼 모음</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">앱 등록하기</span>
              <span className="sm:hidden">등록</span>
            </button>
          </div>
        </div>
      </header>
      <AddAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(app) => {
          onAppAdded(app);
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
