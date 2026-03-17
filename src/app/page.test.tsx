import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("./actions", () => ({
  fetchTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

vi.mock("@/components/TaskBoard", () => ({
  TaskBoard: ({ initialTasks }: { initialTasks: unknown[] }) => (
    <div data-testid="task-board">タスク数: {initialTasks.length}</div>
  ),
}));

import { fetchTasks } from "./actions";
import Home from "./page";

const mockFetchTasks = vi.mocked(fetchTasks);

describe("Home", () => {
  it("タスクを取得してTaskBoardに渡す", async () => {
    mockFetchTasks.mockResolvedValue({
      success: true,
      data: [
        {
          id: "uuid-1",
          title: "テスト",
          description: "",
          status: "TODO",
          position: 0,
          createdAt: "2026-03-17T00:00:00Z",
          updatedAt: "2026-03-17T00:00:00Z",
        },
      ],
    });

    const page = await Home();
    render(page);

    expect(screen.getByText("タスクカンバン")).toBeInTheDocument();
    expect(screen.getByTestId("task-board")).toHaveTextContent("タスク数: 1");
  });

  it("取得失敗時にエラーメッセージを表示する", async () => {
    mockFetchTasks.mockResolvedValue({
      success: false,
      error: "接続エラー",
    });

    const page = await Home();
    render(page);

    expect(screen.getByText("タスクカンバン")).toBeInTheDocument();
    expect(
      screen.getByText("タスクの取得に失敗しました: 接続エラー"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("task-board")).toHaveTextContent("タスク数: 0");
  });
});
