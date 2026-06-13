"use client";

import Link from "next/link";
import { BookOpen, Flame, Star, Target, Trophy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStreakMessage } from "@/lib/utils-app";
import { CATEGORY_LABELS, type BookCategory } from "@/types";

interface DashboardStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  tasksCompleted: number;
  level: number;
}

interface BookProgress {
  id: string;
  title: string;
  category: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  hasPlan: boolean;
}

interface TodayTask {
  id: string;
  title: string;
  completed: boolean;
  actionPlan: {
    book: { title: string };
  };
}

interface DashboardContentProps {
  stats: DashboardStats;
  overallProgress: number;
  bookProgress: BookProgress[];
  todayTasks: TodayTask[];
  totalBooks: number;
}

export function DashboardContent({
  stats,
  overallProgress,
  bookProgress,
  todayTasks,
  totalBooks,
}: DashboardContentProps) {
  const pendingToday = todayTasks.filter((t) => !t.completed);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>
        <p className="text-muted-foreground">
          {getStreakMessage(stats.currentStreak)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">レベル</CardTitle>
            <Trophy className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Lv.{stats.level}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalPoints} ポイント
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">ストリーク</CardTitle>
            <Flame className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak}日</div>
            <p className="text-xs text-muted-foreground">
              最長 {stats.longestStreak}日
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">完了タスク</CardTitle>
            <Target className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasksCompleted}</div>
            <p className="text-xs text-muted-foreground">累計完了数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">登録した本</CardTitle>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">冊</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="size-5 text-yellow-500" />
              今日のタスク
            </CardTitle>
            <CardDescription>
              {pendingToday.length > 0
                ? `${pendingToday.length}件のタスクが残っています`
                : "今日のタスクはすべて完了！"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                今日のタスクはありません
              </p>
            ) : (
              <ul className="space-y-2">
                {todayTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center gap-2 text-sm p-2 rounded-md bg-muted/50"
                  >
                    <span
                      className={
                        task.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }
                    >
                      {task.title}
                    </span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {task.actionPlan.book.title}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>全体の進捗</CardTitle>
            <CardDescription>すべての本の実践進捗</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>完了率</span>
                <span className="font-medium">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>登録した本</CardTitle>
            <CardDescription>各本の実践進捗</CardDescription>
          </div>
          <Button size="sm" render={<Link href="/books/new" />}>
            本を追加
          </Button>
        </CardHeader>
        <CardContent>
          {bookProgress.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="size-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                まだ本が登録されていません
              </p>
              <Button render={<Link href="/books/new" />}>
                最初の本を登録
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookProgress.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="block rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium">{book.title}</h3>
                    <Badge variant="secondary">
                      {CATEGORY_LABELS[book.category as BookCategory] ??
                        book.category}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {book.completedTasks}/{book.totalTasks} タスク完了
                      </span>
                      <span>{book.progress}%</span>
                    </div>
                    <Progress value={book.progress} className="h-2" />
                  </div>
                  {!book.hasPlan && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      プラン未生成 — 詳細ページで生成できます
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
