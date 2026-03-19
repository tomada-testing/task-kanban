import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTaskBoard } from "./useTaskBoard";
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
];

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchTasks.mockResolvedValue({ success: true, data: sampleTasks });
});

describe("useTaskBoard", () => {
  it("initialTasksで初期状態が設定される", () => {
    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    expect(result.current.tasks).toEqual(sampleTasks);
    expect(result.current.formModal).toBeNull();
    expect(result.current.deleteModal).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("handleAddでformModalがaddモードで開く", () => {
    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    act(() => {
      result.current.handleAdd("TODO");
    });

    expect(result.current.formModal).toEqual({
      mode: "add",
      defaultStatus: "TODO",
    });
  });

  it("handleAddでerrorがクリアされる", async () => {
    mockCreateTask.mockResolvedValue({
      success: false,
      error: "作成に失敗しました",
    });

    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    // createTask失敗でerrorをセット
    act(() => {
      result.current.handleAdd("TODO");
    });
    await act(async () => {
      result.current.handleFormSubmit({
        title: "新規タスク",
        description: "",
        status: "TODO",
      });
    });
    expect(result.current.error).toBe("作成に失敗しました");

    // handleAddでerrorがクリアされることを確認
    act(() => {
      result.current.handleAdd("IN_PROGRESS");
    });

    expect(result.current.formModal).toEqual({
      mode: "add",
      defaultStatus: "IN_PROGRESS",
    });
    expect(result.current.error).toBeNull();
  });

  it("handleEditでformModalがeditモードで開く", () => {
    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    act(() => {
      result.current.handleEdit(sampleTasks[0]);
    });

    expect(result.current.formModal).toEqual({
      mode: "edit",
      task: sampleTasks[0],
    });
  });

  it("handleDeleteRequestでdeleteModalが開く", () => {
    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    act(() => {
      result.current.handleDeleteRequest(sampleTasks[0]);
    });

    expect(result.current.deleteModal).toEqual({
      taskId: "uuid-1",
      taskTitle: "TODOタスク",
    });
  });

  it("closeFormModalでformModalがnullになる", () => {
    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    act(() => {
      result.current.handleAdd("TODO");
    });
    expect(result.current.formModal).not.toBeNull();

    act(() => {
      result.current.closeFormModal();
    });

    expect(result.current.formModal).toBeNull();
  });

  it("closeDeleteModalでdeleteModalがnullになる", () => {
    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    act(() => {
      result.current.handleDeleteRequest(sampleTasks[0]);
    });
    expect(result.current.deleteModal).not.toBeNull();

    act(() => {
      result.current.closeDeleteModal();
    });

    expect(result.current.deleteModal).toBeNull();
  });

  it("handleFormSubmit(add)でcreateTaskが呼ばれてformModalが閉じる", async () => {
    const newTask: Task = {
      id: "uuid-3",
      title: "新規タスク",
      description: "",
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

    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    act(() => {
      result.current.handleAdd("TODO");
    });

    await act(async () => {
      result.current.handleFormSubmit({
        title: "新規タスク",
        description: "",
        status: "TODO",
      });
    });

    expect(mockCreateTask).toHaveBeenCalledWith({
      title: "新規タスク",
      description: "",
      status: "TODO",
    });
    expect(result.current.formModal).toBeNull();
    expect(result.current.tasks).toHaveLength(3);
  });

  it("handleFormSubmit(edit)でupdateTaskが呼ばれてformModalが閉じる", async () => {
    const updatedTask: Task = { ...sampleTasks[0], title: "更新タスク" };
    mockUpdateTask.mockResolvedValue({ success: true, data: updatedTask });
    mockFetchTasks.mockResolvedValue({
      success: true,
      data: [updatedTask, sampleTasks[1]],
    });

    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    act(() => {
      result.current.handleEdit(sampleTasks[0]);
    });

    await act(async () => {
      result.current.handleFormSubmit({
        title: "更新タスク",
        description: "説明1",
        status: "TODO",
      });
    });

    expect(mockUpdateTask).toHaveBeenCalledWith("uuid-1", {
      title: "更新タスク",
      description: "説明1",
      status: "TODO",
    });
    expect(result.current.formModal).toBeNull();
    expect(result.current.tasks[0].title).toBe("更新タスク");
  });

  it("handleDeleteConfirmでdeleteTaskが呼ばれてdeleteModalが閉じる", async () => {
    mockDeleteTask.mockResolvedValue({ success: true });
    mockFetchTasks.mockResolvedValue({
      success: true,
      data: [sampleTasks[1]],
    });

    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    act(() => {
      result.current.handleDeleteRequest(sampleTasks[0]);
    });

    await act(async () => {
      result.current.handleDeleteConfirm();
    });

    expect(mockDeleteTask).toHaveBeenCalledWith("uuid-1");
    expect(result.current.deleteModal).toBeNull();
    expect(result.current.tasks).toHaveLength(1);
  });

  it("createTask失敗時にerrorがセットされる", async () => {
    mockCreateTask.mockResolvedValue({
      success: false,
      error: "作成に失敗しました",
    });

    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    act(() => {
      result.current.handleAdd("TODO");
    });

    await act(async () => {
      result.current.handleFormSubmit({
        title: "新規タスク",
        description: "",
        status: "TODO",
      });
    });

    expect(result.current.error).toBe("作成に失敗しました");
    expect(result.current.formModal).not.toBeNull();
  });

  it("deleteTask失敗時にerrorがセットされる", async () => {
    mockDeleteTask.mockResolvedValue({
      success: false,
      error: "削除に失敗しました",
    });

    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    act(() => {
      result.current.handleDeleteRequest(sampleTasks[0]);
    });

    await act(async () => {
      result.current.handleDeleteConfirm();
    });

    expect(result.current.error).toBe("削除に失敗しました");
    expect(result.current.deleteModal).not.toBeNull();
  });

  it("updateTask失敗時にerrorがセットされてformModalが閉じない", async () => {
    mockUpdateTask.mockResolvedValue({
      success: false,
      error: "更新に失敗しました",
    });

    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    act(() => {
      result.current.handleEdit(sampleTasks[0]);
    });

    await act(async () => {
      result.current.handleFormSubmit({
        title: "更新タスク",
        description: "説明1",
        status: "TODO",
      });
    });

    expect(result.current.error).toBe("更新に失敗しました");
    expect(result.current.formModal).not.toBeNull();
  });

  it("handleEditでerrorがクリアされる", async () => {
    mockCreateTask.mockResolvedValue({
      success: false,
      error: "作成に失敗しました",
    });

    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    // createTask失敗でerrorをセット
    act(() => {
      result.current.handleAdd("TODO");
    });
    await act(async () => {
      result.current.handleFormSubmit({
        title: "新規タスク",
        description: "",
        status: "TODO",
      });
    });
    expect(result.current.error).toBe("作成に失敗しました");

    // handleEditでerrorがクリアされることを確認
    act(() => {
      result.current.handleEdit(sampleTasks[0]);
    });

    expect(result.current.formModal).toEqual({
      mode: "edit",
      task: sampleTasks[0],
    });
    expect(result.current.error).toBeNull();
  });

  it("handleDeleteConfirmはdeleteModalがnullの場合何もしない", async () => {
    const { result } = renderHook(() => useTaskBoard(sampleTasks));

    await act(async () => {
      result.current.handleDeleteConfirm();
    });

    expect(mockDeleteTask).not.toHaveBeenCalled();
  });
});
