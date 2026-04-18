"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { AppItem } from "@/types";
import AddAppModal from "./add-app-modal";

interface EditAppButtonProps {
  app: AppItem;
}

export default function EditAppButton({ app }: EditAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState(app);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
      >
        <Pencil className="w-4 h-4" />
        수정
      </button>
      <AddAppModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialData={currentApp}
        onSuccess={(updated) => {
          setCurrentApp(updated);
          setIsOpen(false);
        }}
      />
    </>
  );
}
