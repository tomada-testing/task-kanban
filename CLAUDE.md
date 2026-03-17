# Task Kanban

タスク管理カンバンボードアプリケーション。

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL 17, region: ap-northeast-1)
- **Auth/Client**: @supabase/supabase-js + @supabase/ssr
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest + Testing Library + jsdom
- **Linting**: ESLint 9

## Commands

```bash
npm run dev        # 開発サーバー起動
npm run build      # プロダクションビルド
npm run lint       # ESLint実行
npm run test       # テスト実行 (vitest run)
npm run test:watch # テストウォッチモード
```

## Architecture

標準的な Next.js App Router 構成。パスエイリアス `@/*` → `./src/*`。

```
src/
├── app/             # ルーティング、ページ、レイアウト
├── components/      # 再利用可能なUIコンポーネント
└── lib/             # ユーティリティ、外部サービスクライアント
```

## コーディングルール
- 変更後は必ず `npm test` でテストが通ることを確認してください
- 変更は1つの関心事に絞り、小さい単位で行ってください
- 依頼された範囲以外のコードを変更しないでください

## コーディング規約
- コンポーネントは関数コンポーネントで記述してください
- 変数名・関数名はキャメルケースで書いてください
- コミットメッセージは日本語で書いてください

## テストルール
- 網羅性: 正常系・異常系・境界値を検討してください
- 可読性: テスト名に条件と期待する結果を明示してください
- 保守性: 実装の内部構造ではなくユーザーから見た振る舞いをテストしてください
- 独立性: テスト間で状態を共有しないでください
- 状態遷移: 画面遷移の順方向・逆方向を検証してください
- モック方針: 外部依存のみモック化してください

## 禁止事項
- console.logを本番コードに残さないでください
- 既存のテストを削除しないでください
- any型を使用しないでください

## MCP活用ルール
- Next.js・Supabase・Vitestなどの最新仕様はContext7 MCPを使って公式ドキュメントを確認してください

## Supabase

### 環境変数

`.env.example` に定義。実際の値は `.env.local` に設定。

| 変数名 | 説明 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable Key (`sb_publishable_...` 形式) |

**注意**: 従来の `ANON_KEY`（JWT形式）ではなく、新しい Publishable Key 形式を使用している。REST API に直接 `apikey` ヘッダーで渡しても認証されないため、必ず `@supabase/supabase-js` クライアント経由でアクセスすること。

### クライアント

| ファイル | 用途 | 使用場所 |
|---|---|---|
| `@/lib/supabase/client` | ブラウザ用 (`createBrowserClient`) | Client Components |
| `@/lib/supabase/server` | サーバー用 (`createServerClient` + cookie管理) | Server Components, Route Handlers, Server Actions |

どちらも `createClient()` をエクスポート。サーバー用は `async` 関数（`await cookies()` のため）。

### MCP

Supabase MCP サーバーが利用可能。プロジェクト操作（マイグレーション適用、SQL実行、Edge Functions等）に使用する。
