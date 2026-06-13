"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BOOK_CATEGORIES } from "@/types";

export function BookForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [category, setCategory] = useState("SELF_HELP");
  const [userGoals, setUserGoals] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          keyPoints,
          category,
          userGoals,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "登録に失敗しました");
        return;
      }

      toast.success(
        data.actionPlan
          ? "本を登録し、実践プランを生成しました"
          : "本を登録しました"
      );
      router.push(`/books/${data.book.id}`);
      router.refresh();
    } catch {
      toast.error("登録に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          本を登録する
        </CardTitle>
        <CardDescription>
          読んだ本の内容と実践目標を入力すると、AIが個別の実践プランを生成します
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">本のタイトル *</Label>
            <Input
              id="title"
              placeholder="例: 7つの習慣"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">カテゴリー *</Label>
            <Select value={category} onValueChange={(v) => v && setCategory(v)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="カテゴリーを選択" />
              </SelectTrigger>
              <SelectContent>
                {BOOK_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">本の概要 *</Label>
            <Textarea
              id="summary"
              placeholder="本の主要内容、著者の主張、全体像を記述してください"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyPoints">キーポイント *</Label>
            <Textarea
              id="keyPoints"
              placeholder="印象に残った要点、学んだ概念、引用などを箇条書きで"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userGoals">あなたの実践目標 *</Label>
            <Textarea
              id="userGoals"
              placeholder="この本から何を実践したいですか？どんな変化を望みますか？"
              value={userGoals}
              onChange={(e) => setUserGoals(e.target.value)}
              rows={3}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                AIがプランを生成中...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                登録してプランを生成
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
