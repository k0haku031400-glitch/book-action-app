import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください").max(200),
  summary: z.string().min(10, "概要は10文字以上で入力してください").max(5000),
  keyPoints: z
    .string()
    .min(10, "キーポイントは10文字以上で入力してください")
    .max(5000),
  category: z.enum([
    "BUSINESS",
    "SELF_HELP",
    "TECHNOLOGY",
    "PSYCHOLOGY",
    "LEADERSHIP",
    "CREATIVITY",
    "OTHER",
  ]),
  userGoals: z
    .string()
    .min(10, "実践目標は10文字以上で入力してください")
    .max(2000),
});

export const signUpSchema = z.object({
  name: z.string().min(1, "名前を入力してください").max(100),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .max(100),
});

export const signInSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

export const reflectionSchema = z.object({
  reflection: z
    .string()
    .min(1, "振り返りを入力してください")
    .max(2000),
});

export const taskUpdateSchema = z.object({
  completed: z.boolean(),
  reflection: z.string().max(2000).optional(),
});
