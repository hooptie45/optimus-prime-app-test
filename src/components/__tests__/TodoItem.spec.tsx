/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TodoItem } from "../TodoItem";
import React from "react";

const mockTodo = {
  id: "1",
  content: "Test Todo",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockOnDelete = jest.fn();
const mockOnEdit = jest.fn();

describe("TodoItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <TodoItem
        todo={mockTodo}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );
  });

  it("renders the todo content", () => {
    expect(screen.getByTestId(`todo-content-${mockTodo.id}`)).toHaveTextContent(mockTodo.content);
  });

  it("allows editing the todo content", () => {
    fireEvent.click(screen.getByTestId(`todo-content-${mockTodo.id}`));
    const input = screen.getByTestId(`todo-edit-input-${mockTodo.id}`);
    fireEvent.change(input, { target: { value: "Updated Todo" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnEdit).toHaveBeenCalledWith(mockTodo.id, "Updated Todo");
  });

  it("cancels editing on Escape key press", () => {
    fireEvent.click(screen.getByTestId(`todo-content-${mockTodo.id}`));
    const input = screen.getByTestId(`todo-edit-input-${mockTodo.id}`);
    fireEvent.change(input, { target: { value: "Updated Todo" } });
    fireEvent.keyDown(input, { key: "Escape" });

    expect(screen.getByTestId(`todo-content-${mockTodo.id}`)).toHaveTextContent(mockTodo.content);
  });

  it("shows delete confirmation and deletes the todo", () => {
    fireEvent.click(screen.getByTestId(`todo-delete-${mockTodo.id}`));
    fireEvent.click(screen.getByTestId(`todo-delete-confirm-${mockTodo.id}`));

    expect(mockOnDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it("cancels delete confirmation", () => {
    fireEvent.click(screen.getByTestId(`todo-delete-${mockTodo.id}`));
    fireEvent.click(screen.getByTestId(`todo-delete-cancel-${mockTodo.id}`));

    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});
