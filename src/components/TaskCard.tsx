import type { Task } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card size="sm" className="py-2.5 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="space-y-1.5 px-3">
        <h3 className="text-[13px] font-semibold leading-snug">{task.title}</h3>
        {task.description && (
          <p
            data-testid="task-description"
            className="text-xs leading-relaxed text-muted-foreground"
          >
            {task.description}
          </p>
        )}
        <div className="flex justify-end gap-1 pt-1">
          <Button variant="outline" size="xs" onClick={() => onEdit(task)}>
            <Pencil data-icon="inline-start" />
            編集
          </Button>
          <Button variant="destructive" size="xs" onClick={() => onDelete(task)}>
            <Trash2 data-icon="inline-start" />
            削除
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
