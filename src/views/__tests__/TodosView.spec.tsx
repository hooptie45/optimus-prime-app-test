/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TodosView } from "../TodosView";

jest.mock("@aws-amplify/ui-react", () => ({
  Authenticator: ({ children }: { children: any }) =>
    children({ signOut: jest.fn(), user: { attributes: { email: "test@example.com" } } }),
}));

describe("TodosView", () => {
  it("renders the todos view", () => {
    render(<TodosView />);
    expect(screen.getByText("My Todos")).toBeInTheDocument();
  });

  it("opens the modal when 'Add Todo' button is clicked", () => {
    render(<TodosView />);
    fireEvent.click(screen.getByTestId("add-todo-button"));
    expect(screen.getByTestId("new-todo-input")).toBeInTheDocument();
  });
});
