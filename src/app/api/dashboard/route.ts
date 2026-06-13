import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";
import { prisma } from "@/lib/prisma";
import { calculateProgress } from "@/lib/utils-app";
import { apiSuccess, requireAuth } from "@/lib/api-utils";

export async function GET() {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const userId = session.user.id;
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const [books, stats, todayTasks, weekTasks] = await Promise.all([
    prisma.book.findMany({
      where: { userId },
      include: {
        actionPlan: {
          include: { tasks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userStats.findUnique({ where: { userId } }),
    prisma.task.findMany({
      where: {
        actionPlan: { book: { userId } },
        deadline: { gte: todayStart, lte: todayEnd },
      },
      include: {
        actionPlan: {
          include: { book: { select: { title: true } } },
        },
      },
      orderBy: { order: "asc" },
    }),
    prisma.task.findMany({
      where: {
        actionPlan: { book: { userId } },
        deadline: { gte: weekStart, lte: weekEnd },
      },
      include: {
        actionPlan: {
          include: { book: { select: { title: true } } },
        },
      },
      orderBy: { deadline: "asc" },
    }),
  ]);

  const allTasks = books.flatMap(
    (b) => b.actionPlan?.tasks ?? []
  );
  const overallProgress = calculateProgress(allTasks);

  const bookProgress = books.map((book) => ({
    id: book.id,
    title: book.title,
    category: book.category,
    progress: calculateProgress(book.actionPlan?.tasks ?? []),
    totalTasks: book.actionPlan?.tasks.length ?? 0,
    completedTasks:
      book.actionPlan?.tasks.filter((t) => t.completed).length ?? 0,
    hasPlan: !!book.actionPlan,
  }));

  return apiSuccess({
    stats: stats ?? {
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      tasksCompleted: 0,
      booksCompleted: 0,
      level: 1,
    },
    overallProgress,
    bookProgress,
    todayTasks,
    weekTasks,
    totalBooks: books.length,
  });
}
