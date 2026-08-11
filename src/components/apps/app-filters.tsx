"use client";

import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AppFiltersProps {
  category: string;
  sort: string;
  onCategoryChange: (cat: string) => void;
  onSortChange: (sort: string) => void;
}

export default function AppFilters({
  category,
  sort,
  onCategoryChange,
  onSortChange,
}: AppFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      {/* Category tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              category === cat || (cat === "전체" && !category)
                ? "bg-blue-800 text-white"
                : "bg-white text-slate-600 border border-slate-300 hover:border-blue-400 hover:text-blue-700"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="text-sm border border-slate-300 rounded-md px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
