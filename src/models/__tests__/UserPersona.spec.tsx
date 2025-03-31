/**
 * @jest-environment jsdom
 */

import { parseUserPersona } from "../UserPersona";

describe("UserPersona", () => {
  it("parses user attributes correctly", () => {
    const mockUser = {
      attributes: {
        email: "test@example.com",
        name: "Test User",
        customAttribute: "Custom Value",
      },
    };

    const result = parseUserPersona(mockUser);

    expect(result).toEqual({
      email: "test@example.com",
      name: "Test User",
      customAttribute: "Custom Value",
    });
  });

  it("falls back to 'Unknown' for missing name", () => {
    const mockUser = {
      attributes: {
        email: "test@example.com",
      },
    };

    const result = parseUserPersona(mockUser);

    expect(result).toEqual({
      email: "test@example.com",
      name: "Unknown",
    });
  });

  it("handles additional attributes", () => {
    const mockUser = {
      attributes: {
        email: "test@example.com",
        name: "Test User",
        extra: "Extra Value",
      },
    };

    const result = parseUserPersona(mockUser);

    expect(result).toEqual({
      email: "test@example.com",
      name: "Test User",
      extra: "Extra Value",
    });
  });
});
