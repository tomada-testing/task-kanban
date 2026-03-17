import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskBoard } from "./TaskBoard";
import type { Task } from "@/lib/types";

vi.mock("@/app/actions", () => ({
  fetchTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/app/actions";

const mockFetchTasks = vi.mocked(fetchTasks);
const mockCreateTask = vi.mocked(createTask);
const mockUpdateTask = vi.mocked(updateTask);
const mockDeleteTask = vi.mocked(deleteTask);

const sampleTasks: Task[] = [
  {
    id: "uuid-1",
    title: "TODOタスク",
    description: "説明1",
    status: "TODO",
    position: 0,
    createdAt: "2026-03-17T00:00:00Z",
    updatedAt: "2026-03-17T00:00:00Z",
  },
  {
    id: "uuid-2",
    title: "進行中タスク",
    description: "説明2",
    status: "IN_PROGRESS",
    position: 0,
    createdAt: "2026-03-17T00:00:00Z",
    updatedAt: "2026-03-17T00:00:00Z",
  },
  {
    id: "uuid-3",
    title: "完了タスク",
    description: "",
    status: "DONE",
    position: 0,
    createdAt: "2026-03-17T00:00:00Z",
    updatedAt: "2026-03-17T00:00:00Z",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchTasks.mockResolvedValue({ success: true, data: sampleTasks });
});

describe("TaskBoard", () => {
  it("3つのカラムを表示する", () => {
    render(<TaskBoard initialTasks={sampleTasks} />);

    expect(screen.getByText("TODO")).toBeInTheDocument();
    expect(screen.getByText("IN PROGRESS")).toBeInTheDocument();
    expect(screen.getByText("DONE")).toBeInTheDocument();
  });

  it("タスクを正しいカラムに振り分ける", () => {
    render(<TaskBoard initialTasks={sampleTasks} />);

    expect(screen.getByText("TODOタスク")).toBeInTheDocument();
    expect(screen.getByText("進行中タスク")).toBeInTheDocument();
    expect(screen.getByText("完了タスク")).toBeInTheDocument();
  });

  it("追加ボタンクリックでTaskFormが追加モードで開く", async () => {
    render(<TaskBoard initialTasks={sampleTasks} />);

    const addButtons = screen.getAllByRole("button", { name: "タスクを追加" });
    await userEvent.click(addButtons[0]);

    expect(screen.getByText("タスクを追加")).toBeInTheDocument();
    expect(screen.getByLabelText("タイトル")).toHaveValue("");
  });

  it("編集ボタンクリックでTaskFormが編集モードで開く", async () => {
    render(<TaskBoard initialTasks={sampleTasks} />);

    const editButtons = screen.getAllByRole("button", { name: "編集" });
    await userEvent.click(editButtons[0]);

    expect(screen.getByText("タスクを編集")).toBeInTheDocument();
    expect(screen.getByLabelText("タイトル")).toHaveValue("TODOタスク");
  });

  it("削除ボタンクリックでConfirmDialogが開く", async () => {
    render(<TaskBoard initialTasks={sampleTasks} />);

    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    await userEvent.click(deleteButtons[0]);

    expect(
      screen.getByText('タスク「TODOタスク」を削除しますか？'),
    ).toBeInTheDocument();
  });

  it("ConfirmDialogのキャンセルでダイアログが閉じる", async () => {
    render(<TaskBoard initialTasks={sampleTasks} />);

    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    await userEvent.click(deleteButtons[0]);

    expect(
      screen.getByText('タスク「TODOタスク」を削除しますか？'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));

    expect(
      screen.queryByText('タスク「TODOタスク」を削除しますか？'),
    ).not.toBeInTheDocument();
  });

  it("削除確認でdeleteTaskが呼ばれリストが更新される", async () => {
    mockDeleteTask.mockResolvedValue({ success: true });
    const tasksAfterDelete = sampleTasks.filter((t) => t.id !== "uuid-1");
    mockFetchTasks.mockResolvedValue({
      success: true,
      data: tasksAfterDelete,
    });

    render(<TaskBoard initialTasks={sampleTasks} />);

    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    await userEvent.click(deleteButtons[0]);

    // ConfirmDialog内の削除ボタンをクリック
    const confirmDeleteButtons = screen.getAllByRole("button", {
      name: "削除",
    });
    // ConfirmDialogの削除ボタンは最後にある
    await userEvent.click(confirmDeleteButtons[confirmDeleteButtons.length - 1]);

    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledWith("uuid-1");
    });

    await waitFor(() => {
      expect(mockFetchTasks).toHaveBeenCalled();
    });
  });

  it("タスク追加でcreateTaskが呼ばれリストが更新される", async () => {
    const newTask: Task = {
      id: "uuid-4",
      title: "新規タスク",
      description: "新しい説明",
      status: "TODO",
      position: 1,
      createdAt: "2026-03-17T00:00:00Z",
      updatedAt: "2026-03-17T00:00:00Z",
    };
    mockCreateTask.mockResolvedValue({ success: true, data: newTask });
    mockFetchTasks.mockResolvedValue({
      success: true,
      data: [...sampleTasks, newTask],
    });

    render(<TaskBoard initialTasks={sampleTasks} />);

    const addButtons = screen.getAllByRole("button", { name: "タスクを追加" });
    await userEvent.click(addButtons[0]);

    await userEvent.type(screen.getByLabelText("タイトル"), "新規タスク");
    await userEvent.type(screen.getByLabelText("説明"), "新しい説明");
    await userEvent.click(screen.getByRole("button", { name: "追加" }));

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: "新規タスク",
        description: "新しい説明",
        status: "TODO",
      });
    });
  });

  it("タスク編集でupdateTaskが呼ばれリストが更新される", async () => {
    const updatedTask: Task = {
      ...sampleTasks[0],
      title: "更新タスク",
    };
    mockUpdateTask.mockResolvedValue({ success: true, data: updatedTask });
    mockFetchTasks.mockResolvedValue({
      success: true,
      data: [updatedTask, sampleTasks[1], sampleTasks[2]],
    });

    render(<TaskBoard initialTasks={sampleTasks} />);

    const editButtons = screen.getAllByRole("button", { name: "編集" });
    await userEvent.click(editButtons[0]);

    const titleInput = screen.getByLabelText("タイトル");
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "更新タスク");
    await userEvent.click(screen.getByRole("button", { name: "更新" }));

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith("uuid-1", {
        title: "更新タスク",
        description: "説明1",
        status: "TODO",
      });
    });
  });

  it("アクション失敗時にエラーメッセージを表示する", async () => {
    mockDeleteTask.mockResolvedValue({
      success: false,
      error: "削除に失敗しました",
    });

    render(<TaskBoard initialTasks={sampleTasks} />);

    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    await userEvent.click(deleteButtons[0]);

    const confirmDeleteButtons = screen.getAllByRole("button", {
      name: "削除",
    });
    await userEvent.click(confirmDeleteButtons[confirmDeleteButtons.length - 1]);

    await waitFor(() => {
      expect(screen.getByText("削除に失敗しました")).toBeInTheDocument();
    });
  });
});
