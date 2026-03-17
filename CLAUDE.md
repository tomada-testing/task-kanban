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

Onion Architecture + DDD。パスエイリアス `@/*` → `./src/*`。

```
src/
├── domain/          # ドメインモデル、値オブジェクト、リポジトリインターフェース
├── application/     # ユースケース、アプリケーションサービス
├── infrastructure/  # 外部サービス実装（Supabase等）
├── presentation/    # UIコンポーネント
└── app/             # Next.js App Router（ルーティング層）
```

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
| `@/infrastructure/supabase/client` | ブラウザ用 (`createBrowserClient`) | Client Components |
| `@/infrastructure/supabase/server` | サーバー用 (`createServerClient` + cookie管理) | Server Components, Route Handlers, Server Actions |

どちらも `createClient()` をエクスポート。サーバー用は `async` 関数（`await cookies()` のため）。

### 接続確認

`src/instrumentation.ts` でサーバー起動時に Supabase への接続状況をコンソールに出力する。

```
[Supabase] Connected successfully (https://xxx.supabase.co)
[Supabase] Connection failed: ...
[Supabase] Missing environment variables: ...
```

### MCP

Supabase MCP サーバーが利用可能。プロジェクト操作（マイグレーション適用、SQL実行、Edge Functions等）に使用する。
