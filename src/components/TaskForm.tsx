"use client";

import { useState } from "react";
import type { TaskFormData, TaskStatus } from "@/lib/types";
import { TASK_STATUSES } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TaskFormProps {
  mode: "add" | "edit";
  initialData?: TaskFormData;
  defaultStatus: TaskStatus;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function TaskForm({
  mode,
  initialData,
  defaultStatus,
  onSubmit,
  onCancel,
  isPending,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [status, setStatus] = useState<TaskStatus>(
    initialData?.status ?? defaultStatus,
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("タイトルは必須です");
      return;
    }
    setError("");
    onSubmit({ title, description, status });
  };

  const submitLabel = mode === "add" ? "追加" : "更新";

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "タスクを追加" : "タスクを編集"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">タイトル</Label>
            <Input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-description">説明</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-status">ステータス</Label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              {TASK_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isPending}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
