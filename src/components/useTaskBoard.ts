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

  const closeFormModal = () => setFormModal(null);
  const closeDeleteModal = () => setDeleteModal(null);

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
