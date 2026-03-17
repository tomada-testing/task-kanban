import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TaskForm } from "./TaskForm";

describe("TaskForm", () => {
  const defaultProps = {
    mode: "add" as const,
    defaultStatus: "TODO" as const,
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    isPending: false,
  };

  it("追加モードで空のフォームを表示する", () => {
    render(<TaskForm {...defaultProps} />);

    expect(screen.getByText("タスクを追加")).toBeInTheDocument();
    expect(screen.getByLabelText("タイトル")).toHaveValue("");
    expect(screen.getByLabelText("説明")).toHaveValue("");
  });

  it("編集モードでinitialDataを表示する", () => {
    render(
      <TaskForm
        {...defaultProps}
        mode="edit"
        initialData={{
          title: "既存タスク",
          description: "既存の説明",
          status: "IN_PROGRESS",
        }}
      />,
    );

    expect(screen.getByText("タスクを編集")).toBeInTheDocument();
    expect(screen.getByLabelText("タイトル")).toHaveValue("既存タスク");
    expect(screen.getByLabelText("説明")).toHaveValue("既存の説明");
    expect(screen.getByLabelText("ステータス")).toHaveValue("IN_PROGRESS");
  });

  it("フォーム送信でonSubmitがフォームデータとともに呼ばれる", async () => {
    const onSubmit = vi.fn();
    render(<TaskForm {...defaultProps} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("タイトル"), "新規タスク");
    await userEvent.type(screen.getByLabelText("説明"), "新しい説明");
    await userEvent.click(screen.getByRole("button", { name: "追加" }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "新規タスク",
      description: "新しい説明",
      status: "TODO",
    });
  });

  it("タイトル未入力でバリデーションエラーを表示する", async () => {
    const onSubmit = vi.fn();
    render(<TaskForm {...defaultProps} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole("button", { name: "追加" }));

    expect(screen.getByText("タイトルは必須です")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("キャンセルボタンクリックでonCancelが呼ばれる", async () => {
    const onCancel = vi.fn();
    render(<TaskForm {...defaultProps} onCancel={onCancel} />);

    await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("isPending時に送信ボタンが無効化される", () => {
    render(<TaskForm {...defaultProps} isPending={true} />);

    expect(screen.getByRole("button", { name: "追加" })).toBeDisabled();
  });

  it("編集モードではボタンが「更新」と表示される", () => {
    render(<TaskForm {...defaultProps} mode="edit" />);

    expect(screen.getByRole("button", { name: "更新" })).toBeInTheDocument();
  });
});
