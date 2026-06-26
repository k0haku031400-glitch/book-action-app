import OpenAI from "openai";
import type { GeneratedPlan } from "@/types";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey });
}

export async function generateActionPlan(input: {
  title: string;
  summary: string;
  keyPoints: string;
  category: string;
  userGoals: string;
}): Promise<GeneratedPlan> {
  const openai = getOpenAIClient();

  const prompt = `あなたは読書を実践に変えるコーチです。以下の本の情報とユーザーの目標をもとに、4週間の段階的な実践プランをJSON形式で生成してください。

## 本の情報
- タイトル: ${input.title}
- カテゴリー: ${input.category}
- 概要: ${input.summary}
- キーポイント: ${input.keyPoints}

## ユーザーの実践目標
${input.userGoals}

## 出力形式（JSONのみ、説明文不要）
{
  "goals": ["目標1", "目標2", "目標3"],
  "summary": "プラン全体の概要（200文字以内）",
  "totalWeeks": 4,
  "tasks": [
    {
      "title": "タスク名",
      "description": "具体的な実行内容",
      "frequency": "DAILY" | "WEEKLY" | "ONCE",
      "weekNumber": 1,
      "dayNumber": 1,
      "order": 1
    }
  ]
}

## 要件
- タスクは12〜20個程度
- 第1週は基礎理解、第2-3週は実践、第4週は定着・振り返り
- 各タスクは具体的で測定可能な行動にする
- 日本語で出力`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 3000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AIからの応答がありません");
  }

  const raw = JSON.parse(content) as Record<string, unknown>;

  // トップレベルキーを小文字に正規化（"Tasks" → "tasks" などの表記ゆれを許容）
  const normalized: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    normalized[k.toLowerCase()] = v;
  }

  if (!Array.isArray(normalized.tasks) || normalized.tasks.length === 0) {
    throw new Error("AIの応答にタスクが含まれていません");
  }
  if (!Array.isArray(normalized.goals)) {
    throw new Error("AIの応答の形式が不正です");
  }

  return normalized as unknown as GeneratedPlan;
}
