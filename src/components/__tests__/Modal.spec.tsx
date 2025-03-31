/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Modal } from "../Modal";

describe("Modal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    const onClose = jest.fn();
    const { queryByTestId } = render(
      <Modal isOpen={false} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );
    expect(queryByTestId("modal-overlay")).toBeNull();
    expect(queryByTestId("modal-content")).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should render when isOpen is true", () => {
    const { getByTestId } = render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <div>Content</div>
      </Modal>
    );
    expect(getByTestId("modal-overlay")).toBeInTheDocument();
    expect(getByTestId("modal-content")).toBeInTheDocument();
  });

  it("should call onClose when overlay is clicked", () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );
    fireEvent.click(getByTestId("modal-overlay"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose when modal content is clicked", () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );
    fireEvent.click(getByTestId("modal-content"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should render children inside the modal", () => {
    const { getByText } = render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <div>Test Content</div>
      </Modal>
    );
    expect(getByText("Test Content")).toBeInTheDocument();
  });
});
