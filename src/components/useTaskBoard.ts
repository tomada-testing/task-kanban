"use client";

import { useState, useTransition } from "react";
import type { Task, TaskFormData, TaskStatus } from "@/lib/types";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/app/actions";

type FormModal =
  | { mode: "add"; defaultStatus: TaskStatus }
  | { mode: "edit"; task: Task };

type DeleteModal = { taskId: string; taskTitle: string };

export interface TaskBoardState {
  tasks: Task[];
  formModal: FormModal | null;
  deleteModal: DeleteModal | null;
  error: string | null;
  isPending: boolean;
  handleAdd: (status: TaskStatus) => void;
  handleEdit: (task: Task) => void;
  handleDeleteRequest: (task: Task) => void;
  handleFormSubmit: (data: TaskFormData) => void;
  handleDeleteConfirm: () => void;
  closeFormModal: () => void;
  closeDeleteModal: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logAction(action: string, payload?: any) {
  console.log(`[TaskBoard] ${action}`, payload);
}

export function useTaskBoard(initialTasks: Task[]): TaskBoardState {
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
    logAction("add", { status });
  };

  const handleEdit = (task: Task) => {
    setError(null);
    setFormModal({ mode: "edit", task });
    logAction("edit", { taskId: task.id });
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
        logAction("created", result.data);
      } else if (formModal?.mode === "edit") {
        const result = await updateTask(formModal.task.id, data);
        if (!result.success) {
          setError(result.error ?? "エラーが発生しました");
          return;
        }
        logAction("updated", result.data);
      }
      // NOTE: 成功時のerrorリセット漏れ（前回エラーが残ったまま次の操作ができる）
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

  const closeFormModal = () => setFormModal(null);
  const closeDeleteModal = () => setDeleteModal(null);

  // タスクをステータスでフィルタ（マジックストリング）
  const getTasksByStatus = (status: string) =>
    tasks.filter((t) => t.status === status);

  return {
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
  };
}
