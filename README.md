# BookAction - 読書を実践に変える

読んだ本の知識をAIが個別の実践プランに変換し、習慣化を支援するWebアプリケーションです。

## 機能

- **本情報入力** — タイトル、概要、キーポイント、実践目標、カテゴリー
- **AI分析・提案** — GPT-4o-mini による4週間の段階的実践プラン自動生成
- **実践サポート** — 日次/週次タスク、進捗追跡、振り返り記録
- **継続支援** — ガミフィケーション（ポイント、レベル、ストリーク）
- **ダッシュボード** — 成果の可視化

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | Next.js 16 (App Router), React 19 |
| スタイリング | Tailwind CSS v4, shadcn/ui |
| バックエンド | Next.js API Routes |
| データベース | Prisma + PostgreSQL |
| AI | OpenAI GPT-4o-mini |
| 認証 | NextAuth.js v5 |
| デプロイ | Vercel |

## セットアップ

### 1. 依存関係のインストール

```bash
cd book-action-app
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env` を編集:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."  # openssl rand -base64 32
AUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."  # 任意（未設定時は手動プラン生成不可）
```

### 3. データベースのセットアップ

PostgreSQL を用意し（[Supabase](https://supabase.com) 無料枠でも可）、マイグレーションを実行:

```bash
npm run db:generate
npm run db:migrate
```

### 4. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 でアクセス

## プロジェクト構造

```
book-action-app/
├── src/
│   ├── app/
│   │   ├── (auth)/          # 認証ページ
│   │   ├── dashboard/       # ダッシュボード
│   │   ├── books/           # 本の登録・詳細
│   │   └── api/             # API Routes
│   ├── components/
│   │   ├── ui/              # shadcn/ui
│   │   ├── forms/           # フォーム
│   │   └── dashboard/       # ダッシュボード
│   ├── lib/                 # ユーティリティ
│   └── types/               # 型定義
├── prisma/                  # スキーマ
├── docs/                    # ドキュメント
└── README.md
```

## スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー |
| `npm run db:generate` | Prisma Client 生成 |
| `npm run db:migrate` | マイグレーション実行 |
| `npm run db:studio` | Prisma Studio 起動 |

## Vercel デプロイ

詳細は [docs/DEPLOY.md](docs/DEPLOY.md) を参照してください。

### クイックスタート

1. GitHub にプッシュ
2. [Vercel](https://vercel.com/new) でリポジトリをインポート
3. 環境変数を設定: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `OPENAI_API_KEY`
4. デプロイ

Supabase 等の PostgreSQL を `DATABASE_URL` に設定してください。ビルド時に `prisma migrate deploy` が自動実行されます。

## ドキュメント

- [デプロイガイド](docs/DEPLOY.md)
- [API 仕様書](docs/API.md)
- [ユーザーガイド](docs/USER_GUIDE.md)

## ライセンス

MIT
