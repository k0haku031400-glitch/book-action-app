"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/books/new", label: "本を登録", icon: Plus },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ??
    session?.user?.email?.[0]?.toUpperCase() ??
    "U";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BookOpen className="size-5 text-primary" />
            <span className="hidden sm:inline">BookAction</span>
          </Link>

          {session && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {session ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="relative size-9 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  aria-label="ユーザーメニュー"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="size-4" />
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Sheet>
                <SheetTrigger
                  className="inline-flex md:hidden size-9 items-center justify-center rounded-lg hover:bg-muted"
                  aria-label="メニュー"
                >
                  <Menu className="size-5" />
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>メニュー</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6 flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                          pathname === item.href && "bg-accent"
                        )}
                      >
                        <item.icon className="size-4" />
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/signin"
                className="inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] font-medium hover:bg-muted"
              >
                ログイン
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] bg-primary px-2.5 text-[0.8rem] font-medium text-primary-foreground hover:bg-primary/80"
              >
                新規登録
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
