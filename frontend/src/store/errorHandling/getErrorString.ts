import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const getErrorString = (
  error: FetchBaseQueryError | SerializedError
): string => {

  if ("message" in error) {
    const SerializedError = error as SerializedError;
    if (SerializedError.message) {
      return SerializedError.message;
    }
  } else if (
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "detail" in error.data
  ) {
    const FetchBaseQueryError = error as FetchBaseQueryError;
    const errorData = FetchBaseQueryError.data as { detail: unknown };
    if (errorData.detail && typeof errorData.detail === "string") {
      return errorData.detail;
    }
  }

  return "Unknown error";
};

export default getErrorString;
