import { describe, it, expect, vi } from "vitest";
import { renderUI, screen } from "../../test/utils";
import ButtonComponent from "../ButtonComponent";

describe("ButtonComponent", () => {
  it("renders its text as the label", () => {
    renderUI(<ButtonComponent text="Request a call" />);

    expect(
      screen.getByRole("button", { name: "Request a call" }),
    ).toBeInTheDocument();
  });

  it("prefers children over text when both are given", () => {
    renderUI(
      <ButtonComponent text="Submit">
        <span>Loading…</span>
      </ButtonComponent>,
    );

    expect(screen.getByRole("button")).toHaveTextContent("Loading…");
    expect(screen.getByRole("button")).not.toHaveTextContent("Submit");
  });

  it("calls onPress when clicked", async () => {
    const onPress = vi.fn();
    const { user } = renderUI(<ButtonComponent text="Linn" onPress={onPress} />);

    await user.click(screen.getByRole("button", { name: "Linn" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("calls onPress on keyboard activation", async () => {
    const onPress = vi.fn();
    const { user } = renderUI(<ButtonComponent text="Linn" onPress={onPress} />);

    await user.tab();
    await user.keyboard("{Enter}");

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("applies the styling prop as a class name", () => {
    renderUI(<ButtonComponent text="Submit" styling="bg-accent h-11" />);

    expect(screen.getByRole("button")).toHaveClass("bg-accent", "h-11");
  });

  it("forwards extra props such as type and aria-label to the button", () => {
    renderUI(<ButtonComponent text="✕" type="submit" aria-label="Close" />);

    const button = screen.getByRole("button", { name: "Close" });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("renders without an onPress handler", async () => {
    const { user } = renderUI(<ButtonComponent text="Inert" />);

    await user.click(screen.getByRole("button", { name: "Inert" }));

    expect(screen.getByRole("button", { name: "Inert" })).toBeInTheDocument();
  });
});
