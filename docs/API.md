# BookAction API 仕様書

## 認証

すべての保護されたエンドポイントは NextAuth セッション Cookie が必要です。

---

## POST /api/auth/signup

新規ユーザー登録

**Rate Limit:** 5回 / 5分（IP単位）

### Request Body

```json
{
  "name": "山田 太郎",
  "email": "user@example.com",
  "password": "password123"
}
```

### Response 201

```json
{
  "user": {
    "id": "clx...",
    "name": "山田 太郎",
    "email": "user@example.com"
  }
}
```

### Errors

| Status | Message |
|--------|---------|
| 400 | バリデーションエラー |
| 429 | リクエストが多すぎます |

---

## GET /api/books

ユーザーの登録済み本一覧を取得

### Response 200

```json
[
  {
    "id": "clx...",
    "title": "7つの習慣",
    "summary": "...",
    "keyPoints": "...",
    "category": "SELF_HELP",
    "userGoals": "...",
    "actionPlan": {
      "id": "clx...",
      "goals": ["目標1", "目標2"],
      "summary": "プラン概要",
      "tasks": [...]
    }
  }
]
```

---

## POST /api/books

本を登録し、OpenAI APIキーが設定されている場合は自動でプラン生成

**Rate Limit:** 10回 / 分（ユーザー単位）

### Request Body

```json
{
  "title": "7つの習慣",
  "summary": "本の概要（10文字以上）",
  "keyPoints": "キーポイント（10文字以上）",
  "category": "SELF_HELP",
  "userGoals": "実践目標（10文字以上）"
}
```

**category 値:** `BUSINESS` | `SELF_HELP` | `TECHNOLOGY` | `PSYCHOLOGY` | `LEADERSHIP` | `CREATIVITY` | `OTHER`

### Response 201

```json
{
  "book": { ... },
  "actionPlan": { ... } | null
}
```

---

## GET /api/books/[id]

特定の本の詳細を取得

### Response 200

本オブジェクト（actionPlan と tasks を含む）

### Errors

| Status | Message |
|--------|---------|
| 404 | 本が見つかりません |

---

## POST /api/books/[id]

既存の本に対してAIプランを生成

### Response 201

ActionPlan オブジェクト

### Errors

| Status | Message |
|--------|---------|
| 400 | 既にプランが生成されています |
| 503 | OpenAI APIキーが設定されていません |

---

## DELETE /api/books/[id]

本と関連データを削除

### Response 200

```json
{ "success": true }
```

---

## PATCH /api/tasks/[id]

タスクの完了状態と振り返りを更新

### Request Body

```json
{
  "completed": true,
  "reflection": "今日は〇〇を実践した。〇〇と感じた。"
}
```

### Response 200

更新された Task オブジェクト

**副作用:** タスク完了時にユーザーのポイント・ストリークが更新される

| frequency | ポイント |
|-----------|---------|
| DAILY | 15 |
| WEEKLY | 25 |
| ONCE | 20 |

---

## GET /api/dashboard

ダッシュボード用の集計データを取得

### Response 200

```json
{
  "stats": {
    "totalPoints": 150,
    "currentStreak": 5,
    "longestStreak": 10,
    "tasksCompleted": 12,
    "booksCompleted": 0,
    "level": 2
  },
  "overallProgress": 45,
  "bookProgress": [...],
  "todayTasks": [...],
  "weekTasks": [...],
  "totalBooks": 3
}
```

---

## エラーレスポンス形式

```json
{
  "error": "エラーメッセージ"
}
```

## セキュリティ

- 入力値のサニタイゼーション（XSS対策）
- Rate Limiting（IP / ユーザー単位）
- 認証必須のエンドポイントは所有権チェック実施
