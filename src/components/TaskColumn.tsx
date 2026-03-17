import type { Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onAdd: (status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const statusColors = {
  TODO: {
    columnBg: "bg-white border border-slate-200 dark:bg-zinc-900 dark:border-zinc-700",
    headerIndicator: "bg-blue-500",
    badge:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    addBtn:
      "text-blue-500 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30",
  },
  IN_PROGRESS: {
    columnBg: "bg-white border border-slate-200 dark:bg-zinc-900 dark:border-zinc-700",
    headerIndicator: "bg-amber-500",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    addBtn:
      "text-amber-600 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/30",
  },
  DONE: {
    columnBg: "bg-white border border-slate-200 dark:bg-zinc-900 dark:border-zinc-700",
    headerIndicator: "bg-emerald-500",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    addBtn:
      "text-emerald-500 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/30",
  },
} as const;

export function TaskColumn({
  status,
  label,
  tasks,
  onAdd,
  onEdit,
  onDelete,
}: TaskColumnProps) {
  const colors = statusColors[status];

  return (
    <div
      className={`flex w-72 flex-shrink-0 flex-col overflow-hidden rounded-xl ${colors.columnBg}`}
    >
      <div className={`h-1 w-full ${colors.headerIndicator}`} />
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-zinc-300">
            {label}
          </h2>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colors.badge}`}
          >
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAdd(status)}
          aria-label="タスクを追加"
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-base font-medium ${colors.addBtn}`}
        >
          +
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 pb-3">
        {tasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400 dark:text-zinc-500">
            タスクがありません
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
