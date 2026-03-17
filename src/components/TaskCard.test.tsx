import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TaskCard } from "./TaskCard";
import type { Task } from "@/lib/types";

describe("TaskCard", () => {
  const sampleTask: Task = {
    id: "uuid-1",
    title: "テストタスク",
    description: "テストの説明文です",
    status: "TODO",
    position: 0,
    createdAt: "2026-03-17T00:00:00Z",
    updatedAt: "2026-03-17T00:00:00Z",
  };

  const defaultProps = {
    task: sampleTask,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it("タスクのタイトルと説明を表示する", () => {
    render(<TaskCard {...defaultProps} />);

    expect(screen.getByText("テストタスク")).toBeInTheDocument();
    expect(screen.getByText("テストの説明文です")).toBeInTheDocument();
  });

  it("説明が空の場合は説明欄を表示しない", () => {
    render(
      <TaskCard
        {...defaultProps}
        task={{ ...sampleTask, description: "" }}
      />,
    );

    expect(screen.getByText("テストタスク")).toBeInTheDocument();
    expect(screen.queryByTestId("task-description")).not.toBeInTheDocument();
  });

  it("編集ボタンクリックでonEditがtaskとともに呼ばれる", async () => {
    const onEdit = vi.fn();
    render(<TaskCard {...defaultProps} onEdit={onEdit} />);

    await userEvent.click(screen.getByRole("button", { name: "編集" }));

    expect(onEdit).toHaveBeenCalledWith(sampleTask);
  });

  it("削除ボタンクリックでonDeleteがtaskとともに呼ばれる", async () => {
    const onDelete = vi.fn();
    render(<TaskCard {...defaultProps} onDelete={onDelete} />);

    await userEvent.click(screen.getByRole("button", { name: "削除" }));

    expect(onDelete).toHaveBeenCalledWith(sampleTask);
  });
});
