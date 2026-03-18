"use client";

import { useState, useTransition } from "react";
import type { Task, TaskFormData, TaskStatus } from "@/lib/types";
import { TASK_STATUSES } from "@/lib/types";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/app/actions";
import { TaskColumn } from "./TaskColumn";
import { TaskForm } from "./TaskForm";
import { ConfirmDialog } from "./ConfirmDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TaskBoardProps {
  initialTasks: Task[];
}

type FormModal =
  | { mode: "add"; defaultStatus: TaskStatus }
  | { mode: "edit"; task: Task };

type DeleteModal = { taskId: string; taskTitle: string };

export function TaskBoard({ initialTasks }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [formModal, setFormModal] = useState<FormModal | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const refreshTasks = async () => {
    const result = await fetchTasks();
    if (result.success && result.data) {
      setTasks(result.data);
    }
  };

  const handleAdd = (status: TaskStatus) => {
    setError(null);
    setFormModal({ mode: "add", defaultStatus: status });
  };

  const handleEdit = (task: Task) => {
    setError(null);
    setFormModal({ mode: "edit", task });
  };

  const handleDeleteRequest = (task: Task) => {
    setError(null);
    setDeleteModal({ taskId: task.id, taskTitle: task.title });
  };

  const handleFormSubmit = (data: TaskFormData) => {
    startTransition(async () => {
      if (formModal?.mode === "add") {
        const result = await createTask(data);
        if (!result.success) {
          setError(result.error ?? "エラーが発生しました");
          return;
        }
      } else if (formModal?.mode === "edit") {
        const result = await updateTask(formModal.task.id, data);
        if (!result.success) {
          setError(result.error ?? "エラーが発生しました");
          return;
        }
      }
      setFormModal(null);
      await refreshTasks();
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteModal) return;
    startTransition(async () => {
      const result = await deleteTask(deleteModal.taskId);
      if (!result.success) {
        setError(result.error ?? "エラーが発生しました");
        setDeleteModal(null);
        return;
      }
      setDeleteModal(null);
      await refreshTasks();
    });
  };

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
          onCancel={() => setFormModal(null)}
          isPending={isPending}
        />
      )}

      {deleteModal && (
        <ConfirmDialog
          title="削除確認"
          message={`タスク「${deleteModal.taskTitle}」を削除しますか？`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal(null)}
          isPending={isPending}
        />
      )}
    </div>
  );
}
