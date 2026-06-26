import { startOfDay, isSameDay, subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { taskUpdateSchema } from "@/lib/validations";
import {
  calculateLevel,
  pointsForTask,
  sanitizeInput,
} from "@/lib/utils-app";
import { apiError, apiSuccess, requireAuth } from "@/lib/api-utils";

async function updateUserStats(userId: string, points: number) {
  const today = startOfDay(new Date());
  const stats = await prisma.userStats.findUnique({ where: { userId } });

  if (!stats) {
    await prisma.userStats.create({
      data: {
        userId,
        totalPoints: points,
        tasksCompleted: 1,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
        level: 1,
      },
    });
    return;
  }

  const lastActive = stats.lastActiveDate
    ? startOfDay(stats.lastActiveDate)
    : null;

  let newStreak = stats.currentStreak;
  if (!lastActive || !isSameDay(lastActive, today)) {
    const yesterday = subDays(today, 1);
    if (lastActive && isSameDay(lastActive, yesterday)) {
      newStreak = stats.currentStreak + 1;
    } else {
      newStreak = 1;
    }
  }

  const totalPoints = stats.totalPoints + points;

  await prisma.userStats.update({
    where: { userId },
    data: {
      totalPoints,
      tasksCompleted: stats.tasksCompleted + 1,
      currentStreak: newStreak,
      longestStreak: Math.max(stats.longestStreak, newStreak),
      lastActiveDate: today,
      level: calculateLevel(totalPoints),
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = taskUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "入力が無効です");
    }

    const task = await prisma.task.findFirst({
      where: {
        id,
        actionPlan: {
          book: { userId: session.user.id },
        },
      },
    });

    if (!task) {
      return apiError("タスクが見つかりません", 404);
    }

    const wasCompleted = task.completed;
    const nowCompleted = parsed.data.completed;

    const updated = await prisma.task.update({
      where: { id },
      data: {
        completed: nowCompleted,
        completedAt: nowCompleted ? new Date() : null,
        reflection: parsed.data.reflection
          ? sanitizeInput(parsed.data.reflection)
          : task.reflection,
      },
    });

    // ポイント付与は未完了→完了への変更のみ（再チェックによる二重付与を防ぐ）
    if (!wasCompleted && nowCompleted) {
      try {
        await updateUserStats(session.user.id, pointsForTask(task.frequency));
      } catch (statsError) {
        console.error("Stats update failed:", statsError);
        // タスク更新は成功しているため、stats失敗は200で返す
      }
    }

    return apiSuccess(updated);
  } catch {
    return apiError("タスクの更新に失敗しました", 500);
  }
}
