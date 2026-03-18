"use client";

import type { Task } from "@/lib/types";
import { TASK_STATUSES } from "@/lib/types";
import { useTaskBoard } from "./useTaskBoard";
import { TaskColumn } from "./TaskColumn";
import { TaskForm } from "./TaskForm";
import { ConfirmDialog } from "./ConfirmDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TaskBoardProps {
  initialTasks: Task[];
}

export function TaskBoard({ initialTasks }: TaskBoardProps) {
  const {
    tasks,
    formModal,
    deleteModal,
    error,
    isPending,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    handleFormSubmit,
    handleDeleteConfirm,
    closeFormModal,
    closeDeleteModal,
  } = useTaskBoard(initialTasks);

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {TASK_STATUSES.map((s) => (
          <TaskColumn
            key={s.value}
            status={s.value}
            label={s.label}
            tasks={tasks.filter((t) => t.status === s.value)}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>

      {formModal && (
        <TaskForm
          mode={formModal.mode}
          defaultStatus={
            formModal.mode === "add"
              ? formModal.defaultStatus
              : formModal.task.status
          }
          initialData={
            formModal.mode === "edit"
              ? {
                  title: formModal.task.title,
                  description: formModal.task.description,
                  status: formModal.task.status,
                }
              : undefined
          }
          onSubmit={handleFormSubmit}
          onCancel={closeFormModal}
          isPending={isPending}
        />
      )}

      {deleteModal && (
        <ConfirmDialog
          title="削除確認"
          message={`タスク「${deleteModal.taskTitle}」を削除しますか？`}
          onConfirm={handleDeleteConfirm}
          onCancel={closeDeleteModal}
          isPending={isPending}
        />
      )}
    </div>
  );
}
