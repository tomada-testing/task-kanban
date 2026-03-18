import { fetchTasks } from "./actions";
import { TaskBoard } from "@/components/TaskBoard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Kanban } from "lucide-react";

export default async function Home() {
  const result = await fetchTasks();
  const tasks = result.success && result.data ? result.data : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Kanban className="size-4" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            タスクカンバン
          </h1>
        </div>
      </header>
      <main className="px-6 py-6">
        {!result.success && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle />
            <AlertDescription>
              タスクの取得に失敗しました: {result.error}
            </AlertDescription>
          </Alert>
        )}
        <TaskBoard initialTasks={tasks} />
      </main>
    </div>
  );
}
