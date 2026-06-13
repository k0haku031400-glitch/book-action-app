import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
      <h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>
      <p className="text-muted-foreground mb-8">最終更新日: 2026年6月13日</p>

      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. 収集する情報</h2>
          <p className="text-muted-foreground">
            BookAction（以下「本サービス」）は、サービス提供に必要な以下の情報を収集します。
          </p>
          <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
            <li>アカウント情報（名前、メールアドレス）</li>
            <li>登録した本の情報（タイトル、概要、キーポイント、実践目標）</li>
            <li>実践記録（タスク完了状況、振り返りテキスト）</li>
            <li>利用統計（ポイント、ストリーク等）</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. 情報の利用目的</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>アカウント管理および認証</li>
            <li>AIによる実践プランの生成</li>
            <li>進捗追跡およびダッシュボード表示</li>
            <li>サービスの改善</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. 第三者サービス</h2>
          <p className="text-muted-foreground">
            本サービスは以下の第三者サービスを利用します。各サービスのプライバシーポリシーが適用されます。
          </p>
          <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
            <li>OpenAI — AIプラン生成（本の内容と目標が送信されます）</li>
            <li>Vercel — ホスティング</li>
            <li>PostgreSQL（Supabase等） — データ保存</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. データの保護</h2>
          <p className="text-muted-foreground">
            パスワードはbcryptでハッシュ化して保存します。通信はHTTPSで暗号化されます。
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. ユーザーの権利（GDPR）</h2>
          <p className="text-muted-foreground">
            EU一般データ保護規則（GDPR）に基づき、以下の権利を有します。
          </p>
          <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
            <li>個人データへのアクセス権</li>
            <li>個人データの修正権</li>
            <li>個人データの削除権（アカウント削除により行使可能）</li>
            <li>データポータビリティの権利</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. お問い合わせ</h2>
          <p className="text-muted-foreground">
            プライバシーに関するお問い合わせは、GitHub Issues よりご連絡ください。
          </p>
        </div>
      </section>
    </div>
  );
}
