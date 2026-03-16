import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Home from "./page";

vi.mock("next/image", () => ({
  default: (props: React.ComponentProps<"img">) => <img {...props} />,
}));

describe("Home", () => {
  it("renders the heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1 })
    ).toHaveTextContent("To get started, edit the page.tsx file.");
  });
});
