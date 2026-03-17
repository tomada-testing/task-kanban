import type { Task } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
        {task.title}
      </h3>
      {task.description && (
        <p
          data-testid="task-description"
          className="mt-1 text-sm text-zinc-500 dark:text-zinc-400"
        >
          {task.description}
        </p>
      )}
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
          編集
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          削除
        </button>
      </div>
    </div>
  );
}
