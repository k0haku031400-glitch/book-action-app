import { addDays, startOfDay } from "date-fns";
import type { GeneratedPlanTask, TaskFrequency } from "@/types";

export function calculateDeadline(
  weekNumber: number,
  dayNumber: number | undefined,
  frequency: TaskFrequency,
  planStartDate: Date = new Date()
): Date {
  const start = startOfDay(planStartDate);

  if (frequency === "WEEKLY") {
    return addDays(start, weekNumber * 7 - 1);
  }

  if (frequency === "DAILY" && dayNumber) {
    return addDays(start, (weekNumber - 1) * 7 + dayNumber - 1);
  }

  return addDays(start, weekNumber * 7 - 1);
}

export function buildTaskDeadlines(
  tasks: GeneratedPlanTask[],
  planStartDate: Date = new Date()
) {
  return tasks.map((task) => ({
    ...task,
    deadline: calculateDeadline(
      task.weekNumber,
      task.dayNumber,
      task.frequency,
      planStartDate
    ),
  }));
}

export function calculateProgress(tasks: { completed: boolean }[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

export function calculateLevel(totalPoints: number): number {
  return Math.floor(totalPoints / 100) + 1;
}

export function pointsForTask(frequency: TaskFrequency): number {
  switch (frequency) {
    case "DAILY":
      return 15;
    case "WEEKLY":
      return 25;
    default:
      return 20;
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .trim();
}

export function getStreakMessage(streak: number): string {
  if (streak >= 30) return "🔥 驚異的な継続力！";
  if (streak >= 14) return "⭐ 2週間連続達成中！";
  if (streak >= 7) return "💪 1週間ストリーク！";
  if (streak >= 3) return "🌱 いい調子です！";
  return "📚 今日から始めよう";
}
