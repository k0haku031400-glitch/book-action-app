"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/dashboard/task-list";
import { calculateProgress } from "@/lib/utils-app";
import { CATEGORY_LABELS, type BookCategory } from "@/types";

interface BookDetailClientProps {
  bookId: string;
}

export function BookDetailClient({ bookId }: BookDetailClientProps) {
  const router = useRouter();
  const [book, setBook] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/books/${bookId}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setBook(data);
    } catch {
      toast.error("本が見つかりません");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [bookId, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function generatePlan() {
    setGenerating(true);
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "プラン生成に失敗しました");
        return;
      }
      toast.success("実践プランを生成しました");
      load();
    } catch {
      toast.error("プラン生成に失敗しました");
    } finally {
      setGenerating(false);
    }
  }

  async function deleteBook() {
    if (!confirm("この本と関連するプランを削除しますか？")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("削除しました");
      router.push("/dashboard");
    } catch {
      toast.error("削除に失敗しました");
    } finally {
      setDeleting(false);
    }
  }

  if (loading || !book) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const tasks = book.actionPlan?.tasks ?? [];
  const progress = calculateProgress(tasks);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold truncate">{book.title}</h1>
            <Badge>
              {CATEGORY_LABELS[book.category as BookCategory] ?? book.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            登録日:{" "}
            {format(new Date(book.createdAt), "yyyy年M月d日", { locale: ja })}
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={deleteBook}
          disabled={deleting}
        >
          {deleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
          削除
        </Button>
      </div>

      {book.actionPlan && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>実践進捗</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="plan">
        <TabsList>
          <TabsTrigger value="plan">実践プラン</TabsTrigger>
          <TabsTrigger value="info">本の情報</TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="mt-6">
          {!book.actionPlan ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>実践プラン未生成</CardTitle>
                <CardDescription>
                  AIがあなたの目標に合わせた4週間の実践プランを生成します
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-6">
                <Button onClick={generatePlan} disabled={generating}>
                  {generating ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      プランを生成
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>プラン概要</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {book.actionPlan.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {book.actionPlan.goals.map((goal, i) => (
                      <Badge key={i} variant="secondary">
                        🎯 {goal}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>タスク一覧</CardTitle>
                  <CardDescription>
                    チェックを入れて実践を記録しましょう
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskList tasks={tasks} onTaskUpdate={load} />
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="info" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>概要</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {book.summary}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>キーポイント</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {book.keyPoints}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>実践目標</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {book.userGoals}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface BookData {
  id: string;
  title: string;
  summary: string;
  keyPoints: string;
  category: string;
  userGoals: string;
  createdAt: string;
  actionPlan?: {
    summary: string;
    goals: string[];
    tasks: Array<{
      id: string;
      title: string;
      description: string;
      deadline: string;
      frequency: string;
      weekNumber: number;
      completed: boolean;
      reflection?: string | null;
    }>;
  } | null;
}
