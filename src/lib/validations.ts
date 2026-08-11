import { z } from "zod";

export const createAppSchema = z.object({
  title: z.string().min(1, "앱 이름을 입력하세요").max(100),
  description: z.string().min(1, "설명을 입력하세요").max(500),
  url: z.string().url("올바른 URL을 입력하세요"),
  category: z.string().default("기타"),
  tags: z.array(z.string()).default([]),
  submitterName: z.string().max(50).default("익명"),
});

export const createCommentSchema = z.object({
  authorName: z.string().max(50).default("익명"),
  content: z.string().min(1, "내용을 입력하세요").max(1000),
});

export const adminActionSchema = z.object({
  password: z.string(),
  action: z.enum(["delete_app", "delete_comment", "toggle_approve"]),
  targetId: z.number().int().positive(),
});

export type CreateAppInput = z.infer<typeof createAppSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type AdminActionInput = z.infer<typeof adminActionSchema>;
