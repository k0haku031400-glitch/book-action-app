import { prisma } from "@/lib/prisma";
import { bookSchema } from "@/lib/validations";
import { sanitizeInput, buildTaskDeadlines } from "@/lib/utils-app";
import { generateActionPlan } from "@/lib/openai";
import {
  apiError,
  apiSuccess,
  checkRateLimit,
  requireAuth,
} from "@/lib/api-utils";

export async function GET() {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const books = await prisma.book.findMany({
    where: { userId: session.user.id },
    include: {
      actionPlan: {
        include: {
          tasks: {
            orderBy: [{ weekNumber: "asc" }, { order: "asc" }],
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(books);
}

export async function POST(request: Request) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  if (!checkRateLimit(`books:${session.user.id}`, 10, 60_000)) {
    return apiError("リクエストが多すぎます", 429);
  }

  try {
    const body = await request.json();
    const parsed = bookSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "入力が無効です");
    }

    const data = {
      title: sanitizeInput(parsed.data.title),
      summary: sanitizeInput(parsed.data.summary),
      keyPoints: sanitizeInput(parsed.data.keyPoints),
      category: parsed.data.category,
      userGoals: sanitizeInput(parsed.data.userGoals),
    };

    const book = await prisma.book.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });

    let actionPlan = null;

    if (process.env.OPENAI_API_KEY) {
      try {
        const generated = await generateActionPlan({
          title: data.title,
          summary: data.summary,
          keyPoints: data.keyPoints,
          category: data.category,
          userGoals: data.userGoals,
        });

        const tasksWithDeadlines = buildTaskDeadlines(generated.tasks);

        actionPlan = await prisma.actionPlan.create({
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
      } catch (aiError) {
        console.error("AI plan generation failed:", aiError);
      }
    }

    return apiSuccess({ book, actionPlan }, 201);
  } catch {
    return apiError("本の登録に失敗しました", 500);
  }
}
