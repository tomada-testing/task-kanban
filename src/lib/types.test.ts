import { describe, it, expect } from "vitest";
import { toTask, TASK_STATUSES } from "./types";
import type { TaskRow } from "./types";

describe("toTask", () => {
  it("snake_caseのTaskRowをcamelCaseのTaskに変換する", () => {
    const row: TaskRow = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "テストタスク",
      description: "テストの説明",
      status: "TODO",
      position: 0,
      created_at: "2026-03-17T00:00:00Z",
      updated_at: "2026-03-17T01:00:00Z",
    };

    const task = toTask(row);

    expect(task).toEqual({
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "テストタスク",
      description: "テストの説明",
      status: "TODO",
      position: 0,
      createdAt: "2026-03-17T00:00:00Z",
      updatedAt: "2026-03-17T01:00:00Z",
    });
  });

  it("全てのステータスを正しく変換する", () => {
    const baseRow: TaskRow = {
      id: "test-id",
      title: "タスク",
      description: "",
      status: "IN_PROGRESS",
      position: 1,
      created_at: "2026-03-17T00:00:00Z",
      updated_at: "2026-03-17T00:00:00Z",
    };

    expect(toTask(baseRow).status).toBe("IN_PROGRESS");
    expect(toTask({ ...baseRow, status: "DONE" }).status).toBe("DONE");
    expect(toTask({ ...baseRow, status: "TODO" }).status).toBe("TODO");
  });
});

describe("TASK_STATUSES", () => {
  it("3つのステータスを含む", () => {
    expect(TASK_STATUSES).toHaveLength(3);
  });

  it("TODO, IN_PROGRESS, DONEの順序で定義されている", () => {
    expect(TASK_STATUSES[0]).toEqual({ value: "TODO", label: "TODO" });
    expect(TASK_STATUSES[1]).toEqual({
      value: "IN_PROGRESS",
      label: "IN PROGRESS",
    });
    expect(TASK_STATUSES[2]).toEqual({ value: "DONE", label: "DONE" });
  });
});
