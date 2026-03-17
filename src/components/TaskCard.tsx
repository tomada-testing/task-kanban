import type { Task, TaskStatus } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const statusBorderColor: Record<TaskStatus, string> = {
  TODO: "border-l-blue-500",
  IN_PROGRESS: "border-l-amber-500",
  DONE: "border-l-emerald-500",
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div
      className={`rounded-lg border border-slate-300 border-l-[3px] ${statusBorderColor[task.status]} bg-white p-3 shadow-sm hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800`}
    >
      <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
        {task.title}
      </h3>
      {task.description && (
        <p
          data-testid="task-description"
          className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-zinc-400"
        >
          {task.description}
        </p>
      )}
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
          編集
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          削除
        </button>
      </div>
    </div>
  );
}
