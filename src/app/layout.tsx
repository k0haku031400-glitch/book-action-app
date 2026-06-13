import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BookAction - 読書を実践に変える",
    template: "%s | BookAction",
  },
  description:
    "読んだ本の知識をAIが個別の実践プランに変換。習慣化を支援し、成長を可視化する読書体験変革アプリ。",
  keywords: ["読書", "自己啓発", "習慣化", "実践", "AI", "成長"],
  openGraph: {
    title: "BookAction - 読書を実践に変える",
    description: "本の知識を行動と思考に変換する革新的なソリューション",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
