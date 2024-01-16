export const uninitializedMutation = {
  status: "uninitialized",
  isLoading: false,
  isSuccess: false,
  isError: false,
  originalArgs: undefined,
};

export function pendingMutation(endpointName: string, originalArgs: any) {
  return {
    status: "pending",
    endpointName: endpointName,
    isLoading: true,
    isSuccess: false,
    isError: false,
    originalArgs: originalArgs,
  };
}

export function fulfilledMutation(
  endpointName: string,
  originalArgs: any,
  data: any
) {
  return {
    status: "fulfilled",
    endpointName: endpointName,
    isLoading: false,
    isSuccess: true,
    isError: false,
    originalArgs: originalArgs,
    data: data,
  };
}

export function rejectedMutation(
  endpointName: string,
  originalArgs: any,
) {
  return {
    status: "rejected",
    endpointName: endpointName,
    isLoading: false,
    isSuccess: false,
    isError: true,
    originalArgs: originalArgs,
  };
}
