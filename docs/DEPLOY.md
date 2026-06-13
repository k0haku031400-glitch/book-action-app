# Vercel デプロイガイド

## デプロイ済み URL

| サービス | URL |
|---------|-----|
| **本番アプリ** | https://book-action-app.vercel.app |
| **GitHub** | https://github.com/k0haku031400-glitch/book-action-app |
| **Vercel Dashboard** | https://vercel.com/kohakus-projects-8167aab9/book-action-app |

`main` ブランチへの push で自動デプロイされます。

## 前提

- [GitHub](https://github.com) アカウント
- [Vercel](https://vercel.com) アカウント（GitHub 連携済み）
- PostgreSQL データベース（[Supabase](https://supabase.com) または [Neon](https://neon.tech) 推奨）

## 1. GitHub リポジトリ

```bash
git add .
git commit -m "feat: BookAction アプリ初期実装"
gh repo create book-action-app --public --source=. --remote=origin --push
```

## 2. Vercel でプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/new) を開く
2. **Import Git Repository** から `book-action-app` を選択
3. 以下を確認:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`（デフォルト）
   - **Build Command:** `prisma generate && prisma migrate deploy && next build`

## 3. 環境変数（必須）

Vercel プロジェクト → **Settings** → **Environment Variables** に追加:

| 変数 | 値 | 環境 |
|------|-----|------|
| `DATABASE_URL` | Supabase/Neon の PostgreSQL 接続 URL | Production, Preview, Development |
| `AUTH_SECRET` | `openssl rand -base64 32` で生成 | Production, Preview, Development |
| `AUTH_URL` | `https://your-app.vercel.app`（デプロイ後の URL） | Production |
| `OPENAI_API_KEY` | OpenAI API キー | Production, Preview |

**Preview 環境の `AUTH_URL`:** プレビュー URL は可変のため、本番のみ固定 URL を推奨。プレビューでは認証リダイレクトがずれる場合があります。

### Supabase で DATABASE_URL を取得

1. Supabase プロジェクト作成
2. **Settings** → **Database** → **Connection string** → **URI**
3. `[YOUR-PASSWORD]` を実際のパスワードに置換

例:
```
postgresql://postgres.xxxx:password@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## 4. デプロイ

GitHub に push するたびに Vercel が自動デプロイします。

```bash
git push origin main
```

## 5. CLI からデプロイ（代替）

```bash
npm i -g vercel
vercel login
vercel link
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
vercel env add AUTH_URL
vercel env add OPENAI_API_KEY
vercel --prod
```

## トラブルシューティング

### ビルド失敗: Prisma migrate

- `DATABASE_URL` が Vercel に正しく設定されているか確認
- Supabase では **Transaction pooler**（ポート 6543）を推奨

### ログイン後にリダイレクトエラー

- `AUTH_URL` が本番 URL と一致しているか確認（末尾スラッシュなし）

### AI プランが生成されない

- `OPENAI_API_KEY` が Production 環境に設定されているか確認
