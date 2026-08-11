export interface AppItem {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string | null;
  category: string;
  tags: string[];
  submitterName: string;
  approved: boolean;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    comments: number;
  };
}

export interface Comment {
  id: number;
  appId: number;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface AppsResponse {
  apps: AppItem[];
  total: number;
  page: number;
  pageSize: number;
}
