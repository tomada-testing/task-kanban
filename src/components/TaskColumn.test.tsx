import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TaskColumn } from "./TaskColumn";
import type { Task } from "@/lib/types";

const sampleTasks: Task[] = [
  {
    id: "uuid-1",
    title: "タスク1",
    description: "説明1",
    status: "TODO",
    position: 0,
    createdAt: "2026-03-17T00:00:00Z",
    updatedAt: "2026-03-17T00:00:00Z",
  },
  {
    id: "uuid-2",
    title: "タスク2",
    description: "",
    status: "TODO",
    position: 1,
    createdAt: "2026-03-17T00:00:00Z",
    updatedAt: "2026-03-17T00:00:00Z",
  },
];

describe("TaskColumn", () => {
  const defaultProps = {
    status: "TODO" as const,
    label: "TODO",
    tasks: sampleTasks,
    onAdd: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it("カラムヘッダーにラベルとタスク数を表示する", () => {
    render(<TaskColumn {...defaultProps} />);

    expect(screen.getByText("TODO")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("全タスクを表示する", () => {
    render(<TaskColumn {...defaultProps} />);

    expect(screen.getByText("タスク1")).toBeInTheDocument();
    expect(screen.getByText("タスク2")).toBeInTheDocument();
  });

  it("タスクがない場合に空状態メッセージを表示する", () => {
    render(<TaskColumn {...defaultProps} tasks={[]} />);

    expect(screen.getByText("タスクがありません")).toBeInTheDocument();
  });

  it("追加ボタンクリックでonAddがステータスとともに呼ばれる", async () => {
    const onAdd = vi.fn();
    render(<TaskColumn {...defaultProps} onAdd={onAdd} />);

    await userEvent.click(screen.getByRole("button", { name: "タスクを追加" }));

    expect(onAdd).toHaveBeenCalledWith("TODO");
  });
});
