import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  CheckCircle,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  const features = [
    {
      icon: BookOpen,
      title: "本を登録",
      description: "読んだ本の要点と実践目標を入力するだけ",
    },
    {
      icon: Sparkles,
      title: "AIがプラン生成",
      description: "あなた専用の4週間実践プランを自動作成",
    },
    {
      icon: Target,
      title: "日次タスク",
      description: "具体的で測定可能な行動タスクで着実に前進",
    },
    {
      icon: TrendingUp,
      title: "成長を可視化",
      description: "進捗・ストリーク・ポイントでモチベーション維持",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <section className="w-full max-w-4xl text-center py-12 md:py-20">
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-6">
          <Sparkles className="size-4" />
          読書体験を変革する
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          読んだ知識を
          <br />
          <span className="text-primary">実践する力</span>に変える
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          BookActionは、本の内容をAIが分析し、あなただけの実践プランを生成。
          習慣化支援と進捗追跡で、読書を確かな成長につなげます。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {session ? (
            <Button size="lg" render={<Link href="/dashboard" />}>
              ダッシュボードへ
            </Button>
          ) : (
            <>
              <Button size="lg" render={<Link href="/signup" />}>
                無料で始める
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/signin" />}>
                ログイン
              </Button>
            </>
          )}
        </div>
      </section>

      <section className="w-full max-w-5xl py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border p-6 text-center hover:bg-accent/50 transition-colors"
            >
              <feature.icon className="size-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full max-w-3xl py-12 text-center">
        <h2 className="text-2xl font-bold mb-8">こんな方におすすめ</h2>
        <div className="grid gap-4 sm:grid-cols-2 text-left">
          {[
            "良書を読んでも実践できない",
            "自己啓発本の内容を定着させたい",
            "読書を習慣化したい",
            "成長を可視化してモチベーションを保ちたい",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 p-4 rounded-lg border">
              <CheckCircle className="size-5 text-green-500 shrink-0" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full max-w-3xl py-8 text-center text-sm text-muted-foreground">
        <a href="/privacy" className="hover:underline">
          プライバシーポリシー
        </a>
      </section>
    </div>
  );
}
