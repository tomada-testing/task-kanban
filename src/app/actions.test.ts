import { describe, it, expect, vi, beforeEach } from "vitest";
import type { TaskRow } from "@/lib/types";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { fetchTasks, createTask, updateTask, deleteTask } from "./actions";

const mockCreateClient = vi.mocked(createClient);

const sampleRow: TaskRow = {
  id: "uuid-1",
  title: "テストタスク",
  description: "テストの説明",
  status: "TODO",
  position: 0,
  created_at: "2026-03-17T00:00:00Z",
  updated_at: "2026-03-17T00:00:00Z",
};

function createMockSupabase() {
  const chain = {
    from: vi.fn(),
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    single: vi.fn(),
  };

  chain.from.mockReturnValue(chain);
  chain.select.mockReturnValue(chain);
  chain.insert.mockReturnValue(chain);
  chain.update.mockReturnValue(chain);
  chain.delete.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  chain.order.mockReturnValue(chain);
  chain.limit.mockReturnValue(chain);
  chain.single.mockReturnValue(chain);

  return chain;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchTasks", () => {
  it("タスク一覧を取得して返す", async () => {
    const mock = createMockSupabase();
    mock.order.mockResolvedValue({ data: [sampleRow], error: null });
    mockCreateClient.mockResolvedValue(mock as never);

    const result = await fetchTasks();

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data![0].id).toBe("uuid-1");
    expect(result.data![0].title).toBe("テストタスク");
    expect(result.data![0].createdAt).toBe("2026-03-17T00:00:00Z");
    expect(mock.from).toHaveBeenCalledWith("tasks");
  });

  it("Supabaseエラー時にエラーを返す", async () => {
    const mock = createMockSupabase();
    mock.order.mockResolvedValue({
      data: null,
      error: { message: "DB接続エラー" },
    });
    mockCreateClient.mockResolvedValue(mock as never);

    const result = await fetchTasks();

    expect(result.success).toBe(false);
    expect(result.error).toBe("DB接続エラー");
  });
});

describe("createTask", () => {
  it("タスクを作成して返す", async () => {
    const mock = createMockSupabase();
    mock.limit.mockResolvedValue({ data: [], error: null });
    mock.single.mockResolvedValue({
      data: { ...sampleRow, position: 0 },
      error: null,
    });
    mockCreateClient.mockResolvedValue(mock as never);

    const result = await createTask({
      title: "テストタスク",
      description: "テストの説明",
      status: "TODO",
    });

    expect(result.success).toBe(true);
    expect(result.data!.title).toBe("テストタスク");
  });

  it("タイトルが空の場合バリデーションエラーを返す", async () => {
    const result = await createTask({
      title: "",
      description: "",
      status: "TODO",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("タイトルは必須です");
  });

  it("タイトルが空白のみの場合バリデーションエラーを返す", async () => {
    const result = await createTask({
      title: "   ",
      description: "",
      status: "TODO",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("タイトルは必須です");
  });

  it("タイトルが255文字を超える場合バリデーションエラーを返す", async () => {
    const result = await createTask({
      title: "あ".repeat(256),
      description: "",
      status: "TODO",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("タイトルは255文字以内で入力してください");
  });

  it("既存タスクがある場合positionをmax+1に設定する", async () => {
    const mock = createMockSupabase();
    mock.limit.mockResolvedValue({
      data: [{ position: 5 }],
      error: null,
    });
    mock.single.mockResolvedValue({
      data: { ...sampleRow, position: 6 },
      error: null,
    });
    mockCreateClient.mockResolvedValue(mock as never);

    const result = await createTask({
      title: "新規タスク",
      description: "",
      status: "TODO",
    });

    expect(result.success).toBe(true);
    expect(mock.insert).toHaveBeenCalledWith(
      expect.objectContaining({ position: 6 }),
    );
  });

  it("タイトルと説明の前後空白をトリムする", async () => {
    const mock = createMockSupabase();
    mock.limit.mockResolvedValue({ data: [], error: null });
    mock.single.mockResolvedValue({
      data: sampleRow,
      error: null,
    });
    mockCreateClient.mockResolvedValue(mock as never);

    await createTask({
      title: "  タスク  ",
      description: "  説明  ",
      status: "TODO",
    });

    expect(mock.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "タスク",
        description: "説明",
      }),
    );
  });
});

describe("updateTask", () => {
  it("タスクを更新して返す", async () => {
    const mock = createMockSupabase();
    mock.single.mockResolvedValue({
      data: { ...sampleRow, title: "更新タスク" },
      error: null,
    });
    mockCreateClient.mockResolvedValue(mock as never);

    const result = await updateTask("uuid-1", {
      title: "更新タスク",
      description: "テストの説明",
      status: "TODO",
    });

    expect(result.success).toBe(true);
    expect(result.data!.title).toBe("更新タスク");
    expect(mock.eq).toHaveBeenCalledWith("id", "uuid-1");
  });

  it("タイトルが空の場合バリデーションエラーを返す", async () => {
    const result = await updateTask("uuid-1", {
      title: "",
      description: "",
      status: "TODO",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("タイトルは必須です");
  });

  it("タイトルが255文字を超える場合バリデーションエラーを返す", async () => {
    const result = await updateTask("uuid-1", {
      title: "あ".repeat(256),
      description: "",
      status: "TODO",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("タイトルは255文字以内で入力してください");
  });
});

describe("deleteTask", () => {
  it("タスクを削除する", async () => {
    const mock = createMockSupabase();
    mock.eq.mockResolvedValue({ error: null });
    mockCreateClient.mockResolvedValue(mock as never);

    const result = await deleteTask("uuid-1");

    expect(result.success).toBe(true);
    expect(mock.from).toHaveBeenCalledWith("tasks");
    expect(mock.eq).toHaveBeenCalledWith("id", "uuid-1");
  });

  it("Supabaseエラー時にエラーを返す", async () => {
    const mock = createMockSupabase();
    mock.eq.mockResolvedValue({
      error: { message: "削除エラー" },
    });
    mockCreateClient.mockResolvedValue(mock as never);

    const result = await deleteTask("uuid-1");

    expect(result.success).toBe(false);
    expect(result.error).toBe("削除エラー");
  });
});
