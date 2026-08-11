"use client";

import { AppItem } from "@/types";
import AppCard from "./app-card";
import AppCardSkeleton from "./app-card-skeleton";
import { LayoutGrid } from "lucide-react";

interface AppGridProps {
  apps: AppItem[];
  isLoading?: boolean;
}

export default function AppGrid({ apps, isLoading }: AppGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <AppCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <LayoutGrid className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-base font-medium">등록된 앱이 없습니다.</p>
        <p className="text-sm mt-1">첫 번째 앱을 등록해보세요!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
