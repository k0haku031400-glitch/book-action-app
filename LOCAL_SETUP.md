# ローカル開発環境セットアップ（完了済み）

## プロジェクトの場所

```
~/book-action-app
```

## 起動方法

```bash
cd ~/book-action-app
npm run dev -- -p 3001
```

http://localhost:3001 を開く（ポート3000はGrafanaが使用中のため3001を使用）

## 環境変数

`.env.local` は Vercel 本番環境から取得済み（`vercel env pull`）

| 変数 | 説明 |
|------|------|
| `DATABASE_URL` | 本番と同じ PostgreSQL（Vercel/Prisma Accelerate） |
| `AUTH_SECRET` | 認証シークレット |
| `AUTH_URL` | `http://localhost:3001`（ローカル用に設定済み） |
| `GOOGLE_CLIENT_ID` / `SECRET` | Googleログイン |
| `NEXT_PUBLIC_GOOGLE_ENABLED` | `true` |

## Google OAuth（ローカル）

Google Cloud Console に以下を追加:

```
http://localhost:3001/api/auth/callback/google
```

## 注意

- **本番DBに接続しています** — ローカルでの操作が本番データに反映されます
- `npm run db:migrate` は実行しないでください（本番DBのリセットを求められることがあります）
- スキーマ変更は本番デプロイのマイグレーション経由で行ってください

## 開発フロー

```
コード編集 → git commit → git push → Vercel 自動デプロイ
```

## Vercel リンク

```bash
vercel link   # 済み（.vercel フォルダあり）
vercel env pull .env.local --environment=production  # 環境変数を再取得
```
