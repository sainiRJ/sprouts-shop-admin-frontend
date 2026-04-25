export const getApiErrorMessage = (error, fallbackMessage) => {
  const apiError = error?.data?.error;

  if (typeof apiError === "string" && apiError.trim()) {
    return apiError;
  }

  if (apiError && typeof apiError === "object") {
    if (typeof apiError.message === "string" && apiError.message.trim()) {
      return apiError.message;
    }

    if (Array.isArray(apiError.details) && apiError.details.length > 0) {
      const first = apiError.details[0];
      if (typeof first?.message === "string" && first.message.trim()) {
        return first.message;
      }
    }
  }

  if (typeof error?.error === "string" && error.error.trim()) {
    return error.error;
  }

  return fallbackMessage;
};
