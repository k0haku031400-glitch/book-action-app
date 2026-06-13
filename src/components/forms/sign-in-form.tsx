"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("メールアドレスまたはパスワードが正しくありません");
      } else {
        toast.success("ログインしました");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">ログイン</CardTitle>
        <CardDescription>
          アカウントにログインして実践を続けましょう
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            ログイン
          </Button>
          {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              Googleでログイン
            </Button>
          )}
          <p className="text-sm text-muted-foreground text-center">
            アカウントをお持ちでない方は{" "}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              新規登録
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
