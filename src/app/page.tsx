"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AppGrid from "@/components/apps/app-grid";
import SearchBar from "@/components/apps/search-bar";
import AppFilters from "@/components/apps/app-filters";
import { AppItem, AppsResponse } from "@/types";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [apps, setApps] = useState<AppItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "전체");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const debouncedSearch = useDebounce(search, 300);

  const fetchApps = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (category && category !== "전체") params.set("category", category);
      params.set("sort", sort);

      const res = await fetch(`/api/apps?${params.toString()}`);
      const data: AppsResponse = await res.json();
      setApps(data.apps);
      setTotal(data.total);
    } catch {
      setApps([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, category, sort]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "전체") params.set("category", category);
    if (sort !== "newest") params.set("sort", sort);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [search, category, sort, router]);

  function handleAppAdded(app: AppItem) {
    setApps((prev) => [app, ...prev]);
    setTotal((prev) => prev + 1);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header onAppAdded={handleAppAdded} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search */}
        <div className="mb-4">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <AppFilters
            category={category}
            sort={sort}
            onCategoryChange={setCategory}
            onSortChange={setSort}
          />
        </div>

        {/* Result count */}
        {!isLoading && (
          <div className="mb-4 text-sm text-slate-500">
            총 <span className="font-semibold text-slate-700">{total}</span>개의 앱
          </div>
        )}

        {/* Grid */}
        <AppGrid apps={apps} isLoading={isLoading} />
      </main>

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
