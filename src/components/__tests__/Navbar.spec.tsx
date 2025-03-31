/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar } from "../Navbar";

describe("Navbar", () => {
  it("renders links and user persona", () => {
    render(
      <Router>
        <Navbar userPersona="John Doe" onSignOut={jest.fn()} />
      </Router>
    );

    expect(screen.getByText("Todos")).toBeInTheDocument();
    expect(screen.getByText("DataSource")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("calls onSignOut when sign-out button is clicked", () => {
    const onSignOut = jest.fn();
    render(
      <Router>
        <Navbar userPersona="John Doe" onSignOut={onSignOut} />
      </Router>
    );

    fireEvent.click(screen.getByTestId("sign-out-button"));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
