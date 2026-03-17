import { fetchTasks } from "./actions";
import { TaskBoard } from "@/components/TaskBoard";

export default async function Home() {
  const result = await fetchTasks();
  const tasks = result.success && result.data ? result.data : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <header className="border-b border-slate-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
          タスクカンバン
        </h1>
      </header>
      <main className="p-6">
        {!result.success && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            タスクの取得に失敗しました: {result.error}
          </div>
        )}
        <TaskBoard initialTasks={tasks} />
      </main>
    </div>
  );
}
