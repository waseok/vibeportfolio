export const CATEGORIES = ["전체", "행정", "수업", "평가", "소통", "기타"] as const;
export type Category = (typeof CATEGORIES)[number];

export const SORT_OPTIONS = [
  { value: "newest", label: "최신순" },
  { value: "most_visited", label: "조회수순" },
  { value: "most_comments", label: "피드백순" },
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  행정: "bg-blue-100 text-blue-700",
  수업: "bg-green-100 text-green-700",
  평가: "bg-orange-100 text-orange-700",
  소통: "bg-purple-100 text-purple-700",
  기타: "bg-gray-100 text-gray-700",
};

export const CATEGORY_GRADIENTS: Record<string, string> = {
  행정: "from-blue-500 to-blue-700",
  수업: "from-green-500 to-green-700",
  평가: "from-orange-500 to-orange-700",
  소통: "from-purple-500 to-purple-700",
  기타: "from-slate-500 to-slate-700",
};
