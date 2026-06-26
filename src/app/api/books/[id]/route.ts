import { prisma } from "@/lib/prisma";
import { generateActionPlan } from "@/lib/openai";
import { buildTaskDeadlines } from "@/lib/utils-app";
import { apiError, apiSuccess, requireAuth } from "@/lib/api-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;

  try {
    const book = await prisma.book.findFirst({
      where: { id, userId: session.user.id },
      include: {
        actionPlan: {
          include: {
            tasks: {
              orderBy: [{ weekNumber: "asc" }, { order: "asc" }],
            },
          },
        },
      },
    });

    if (!book) {
      return apiError("本が見つかりません", 404);
    }

    return apiSuccess(book);
  } catch {
    return apiError("本の取得に失敗しました", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;

  try {
    const book = await prisma.book.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!book) {
      return apiError("本が見つかりません", 404);
    }

    await prisma.book.delete({ where: { id } });

    return apiSuccess({ success: true });
  } catch {
    return apiError("本の削除に失敗しました", 500);
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;

  if (!process.env.OPENAI_API_KEY) {
    return apiError("OpenAI APIキーが設定されていません", 503);
  }

  const book = await prisma.book.findFirst({
    where: { id, userId: session.user.id },
    include: { actionPlan: true },
  });

  if (!book) {
    return apiError("本が見つかりません", 404);
  }

  if (book.actionPlan) {
    return apiError("既にプランが生成されています");
  }

  try {
    const generated = await generateActionPlan({
      title: book.title,
      summary: book.summary,
      keyPoints: book.keyPoints,
      category: book.category,
      userGoals: book.userGoals,
    });

    const tasksWithDeadlines = buildTaskDeadlines(generated.tasks);

    const actionPlan = await prisma.actionPlan.create({
      data: {
        bookId: book.id,
        goals: generated.goals,
        summary: generated.summary,
        tasks: {
          create: tasksWithDeadlines.map((task) => ({
            title: task.title,
            description: task.description,
            deadline: task.deadline,
            frequency: task.frequency,
            weekNumber: task.weekNumber,
            dayNumber: task.dayNumber ?? null,
            order: task.order,
          })),
        },
      },
      include: {
        tasks: {
          orderBy: [{ weekNumber: "asc" }, { order: "asc" }],
        },
      },
    });

    return apiSuccess(actionPlan, 201);
  } catch {
    return apiError("プラン生成に失敗しました", 500);
  }
}
