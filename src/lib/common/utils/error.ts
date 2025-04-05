export function createErrorResponse(errorData: {
  status: number;
  message: string;
}) {
  const errorDataString = JSON.stringify(errorData);
  return new Error(errorDataString);
}

export function parseError(
  error: unknown,
  {
    defaultStatus = 500,
    defaultMessage,
  }: { defaultStatus?: number; defaultMessage: string } = {
    defaultStatus: 500,
    defaultMessage: "An error occurred",
  }
) {
  const formattedError = formatErrorMessage(error, undefined, false);

  try {
    const parsedError = JSON.parse(formattedError);
    const status = parsedError.status || defaultStatus;
    const message = parsedError.message || defaultMessage;
    if (typeof status !== "number" || typeof message !== "string") {
      throw Error();
    }
    return {
      status,
      message,
    };
  } catch (e) {
    return {
      status: defaultStatus,
      message: formattedError,
    };
  }
}

export function formatErrorMessage(
  error: any,
  defaultMessage: string = "An error occurred",
  deepCheck: boolean = true
): string {
  if (
    typeof error === "string" &&
    error !== "An error occurred" // Prefer provided default message if any if the error message is already the default
  ) {
    return error;
  }

  if (deepCheck && typeof error?.response?.data?.message === "string") {
    return error.response.data.message;
  }

  if (deepCheck && typeof error?.data?.message === "string") {
    return error.data.message;
  }

  if (typeof error?.message === "string") {
    if (
      !(
        error.message?.startsWith("\nInvalid `prisma") &&
        process.env.NODE_ENV !== "development"
      ) // Don't show prisma errors in production
    ) {
      return error.message;
    }
  }

  return defaultMessage;
}
