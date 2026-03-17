import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ConfirmDialog } from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  const defaultProps = {
    title: "削除確認",
    message: "タスク「テスト」を削除しますか？",
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    isPending: false,
  };

  it("タイトルとメッセージを表示する", () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByText("削除確認")).toBeInTheDocument();
    expect(
      screen.getByText("タスク「テスト」を削除しますか？"),
    ).toBeInTheDocument();
  });

  it("確認ボタンクリックでonConfirmが呼ばれる", async () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    await userEvent.click(screen.getByRole("button", { name: "削除" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("キャンセルボタンクリックでonCancelが呼ばれる", async () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("isPending時に確認ボタンが無効化される", () => {
    render(<ConfirmDialog {...defaultProps} isPending={true} />);

    expect(screen.getByRole("button", { name: "削除" })).toBeDisabled();
  });

  it("isPending時でもキャンセルボタンは有効", () => {
    render(<ConfirmDialog {...defaultProps} isPending={true} />);

    expect(screen.getByRole("button", { name: "キャンセル" })).toBeEnabled();
  });
});
