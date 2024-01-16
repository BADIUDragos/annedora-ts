import { describe, it, expect } from "vitest";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import getErrorString from "../getErrorString";

describe("getErrorString function", () => {
  it("should return the message from a SerializedError", () => {
    const serializedError: SerializedError = {
      name: "ErrorName",
      message: "SerializedError Message",
    };

    const result = getErrorString(serializedError);

    expect(result).toBe("SerializedError Message");
  });

  it("should return the detail from a FetchBaseQueryError if it's a string", () => {
    const fetchBaseQueryError: FetchBaseQueryError = {
      status: 400,
      data: {
        detail: "FetchBaseQueryError Detail",
      },
    };

    const result = getErrorString(fetchBaseQueryError);

    expect(result).toBe("FetchBaseQueryError Detail");
  });

  it('should return "Unknown error" for error objects without message or detail', () => {
    const errorWithoutMessageOrDetail = {
      status: 500,
      data: { notDetail: 'Some error data' }
    };
    
    const result = getErrorString(errorWithoutMessageOrDetail);
    expect(result).toBe('Unknown error');
  });

  it('should return "Unknown error" for error objects with non-string detail', () => {
    const errorWithNonStringDetail = {
      status: 500,
      data: { detail: { some: 'object' } }
    };
    
    const result = getErrorString(errorWithNonStringDetail);
    expect(result).toBe('Unknown error');
  });
});