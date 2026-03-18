import type { Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

interface TaskColumnProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onAdd: (status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const statusDot: Record<TaskStatus, string> = {
  TODO: "bg-blue-500",
  IN_PROGRESS: "bg-amber-500",
  DONE: "bg-emerald-500",
};

export function TaskColumn({
  status,
  label,
  tasks,
  onAdd,
  onEdit,
  onDelete,
}: TaskColumnProps) {
  return (
    <Card className="flex w-72 flex-shrink-0 flex-col gap-0 py-0">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center gap-2.5">
          <div className={`size-2.5 rounded-full ${statusDot[status]}`} />
          <span className="text-[13px] uppercase tracking-wide">{label}</span>
          <Badge variant="secondary">{tasks.length}</Badge>
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onAdd(status)}
            aria-label="タスクを追加"
          >
            <Plus />
          </Button>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 px-2.5 pb-2.5 pt-2.5">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2">
            {tasks.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
