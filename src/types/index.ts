export type BookCategory =
  | "BUSINESS"
  | "SELF_HELP"
  | "TECHNOLOGY"
  | "PSYCHOLOGY"
  | "LEADERSHIP"
  | "CREATIVITY"
  | "OTHER";

export type TaskFrequency = "DAILY" | "WEEKLY" | "ONCE";

export interface Book {
  id: string;
  title: string;
  summary: string;
  keyPoints: string;
  category: BookCategory;
  userGoals: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  frequency: TaskFrequency;
  weekNumber: number;
  dayNumber?: number | null;
  completed: boolean;
  completedAt?: Date | null;
  reflection?: string | null;
  order: number;
}

export interface ActionPlan {
  id: string;
  bookId: string;
  goals: string[];
  summary: string;
  tasks: Task[];
  createdAt: Date;
}

export interface Schedule {
  totalWeeks: number;
  dailyTasks: Task[];
  weeklyTasks: Task[];
}

export interface UserStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  tasksCompleted: number;
  booksCompleted: number;
  level: number;
}

export interface GeneratedPlanTask {
  title: string;
  description: string;
  frequency: TaskFrequency;
  weekNumber: number;
  dayNumber?: number;
  order: number;
}

export interface GeneratedPlan {
  goals: string[];
  summary: string;
  tasks: GeneratedPlanTask[];
  totalWeeks: number;
}

export const BOOK_CATEGORIES: { value: BookCategory; label: string }[] = [
  { value: "BUSINESS", label: "ビジネス" },
  { value: "SELF_HELP", label: "自己啓発" },
  { value: "TECHNOLOGY", label: "技術書" },
  { value: "PSYCHOLOGY", label: "心理学" },
  { value: "LEADERSHIP", label: "リーダーシップ" },
  { value: "CREATIVITY", label: "創造性" },
  { value: "OTHER", label: "その他" },
];

export const CATEGORY_LABELS: Record<BookCategory, string> = {
  BUSINESS: "ビジネス",
  SELF_HELP: "自己啓発",
  TECHNOLOGY: "技術書",
  PSYCHOLOGY: "心理学",
  LEADERSHIP: "リーダーシップ",
  CREATIVITY: "創造性",
  OTHER: "その他",
};
