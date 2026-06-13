import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/validations";
import { apiError, apiSuccess, checkRateLimit } from "@/lib/api-utils";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  if (!checkRateLimit(`signup:${ip}`, 5, 300_000)) {
    return apiError("リクエストが多すぎます。しばらく待ってから再試行してください。", 429);
  }

  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "入力が無効です");
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return apiError("このメールアドレスは既に登録されています");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        stats: {
          create: {},
        },
      },
      select: { id: true, name: true, email: true },
    });

    return apiSuccess({ user }, 201);
  } catch {
    return apiError("登録に失敗しました", 500);
  }
}
