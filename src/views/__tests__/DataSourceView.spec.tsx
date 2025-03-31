/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DataSourceView } from "../DataSourceView";

jest.mock("@aws-amplify/ui-react", () => ({
  Authenticator: ({ children }: { children: any }) =>
    children({ signOut: jest.fn(), user: { attributes: { email: "test@example.com" } } }),
}));

jest.mock("aws-amplify/data", () => ({
  generateClient: () => ({
    models: {
      DataSource: {
        list: jest.fn(() => Promise.resolve({ items: [{ id: "1", name: "Test Source", url: "http://example.com" }] })),
      },
    },
  }),
}));

describe("DataSourceView", () => {
  it("renders the data source view", async () => {
    render(<DataSourceView />);
    expect(await screen.findByText("Test Source")).toBeInTheDocument();
    expect(await screen.findByText("http://example.com")).toBeInTheDocument();
  });
});
