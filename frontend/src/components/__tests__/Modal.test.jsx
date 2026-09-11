import { describe, it, expect, vi } from "vitest";
import { renderUI, screen } from "../../test/utils";
import Modal from "../Modal";

describe("Modal", () => {
  it("renders its children through a portal on document.body", () => {
    const { container } = renderUI(
      <Modal>
        <p>Modal contents</p>
      </Modal>,
    );

    // Nothing lands where the component was mounted...
    expect(container.querySelector(".modal-backdrop")).toBeNull();
    expect(container).not.toHaveTextContent("Modal contents");
    // ...it is portalled to the end of the body instead.
    expect(screen.getByText("Modal contents")).toBeInTheDocument();
    expect(document.body).toContainElement(screen.getByText("Modal contents"));
  });

  it("hides the backdrop from assistive tech", () => {
    renderUI(
      <Modal>
        <p>Modal contents</p>
      </Modal>,
    );

    const backdrop = document.querySelector(".modal-backdrop");
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
  });

  it("calls onBackdropClick when the backdrop is clicked", async () => {
    const onBackdropClick = vi.fn();
    const { user } = renderUI(
      <Modal onBackdropClick={onBackdropClick}>
        <p>Modal contents</p>
      </Modal>,
    );

    await user.click(document.querySelector(".modal-backdrop"));

    expect(onBackdropClick).toHaveBeenCalledTimes(1);
  });

  it("leaves the backdrop inert when no handler is given", async () => {
    const { user } = renderUI(
      <Modal>
        <p>Modal contents</p>
      </Modal>,
    );

    await user.click(document.querySelector(".modal-backdrop"));

    expect(screen.getByText("Modal contents")).toBeInTheDocument();
  });

  it("does not dismiss when the content itself is clicked", async () => {
    const onBackdropClick = vi.fn();
    const { user } = renderUI(
      <Modal onBackdropClick={onBackdropClick}>
        <button type="button">Inside</button>
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: "Inside" }));

    expect(onBackdropClick).not.toHaveBeenCalled();
  });

  it("removes its portal content when unmounted", () => {
    const { unmount } = renderUI(
      <Modal>
        <p>Modal contents</p>
      </Modal>,
    );

    unmount();

    expect(screen.queryByText("Modal contents")).not.toBeInTheDocument();
    expect(document.querySelector(".modal-backdrop")).toBeNull();
  });
});
