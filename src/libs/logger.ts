"use client";

import type { Middleware } from "@reduxjs/toolkit";

import { addToast } from "@heroui/react";
import { isFulfilled, isRejectedWithValue } from "@reduxjs/toolkit";

export const logger: Middleware = () => (next) => (action) => {
  const METHOD_ALLOWED = ["POST", "DELETE", "PUT", "PATCH"];
  const disabledPaths = "authSession";

  if ((action as any).meta?.arg?.endpointName === disabledPaths) {
    return next(action);
  }

  if (
    isRejectedWithValue(action) &&
    METHOD_ALLOWED.includes((action.meta as unknown as any).baseQueryMeta?.request.method)
  ) {
    addToast({
      color: "danger",
      description: (action.payload as any)?.data?.message,
      title: "Error ao realiza ação",
    });
  }

  if (
    isFulfilled(action) &&
    METHOD_ALLOWED.includes((action.meta as unknown as any).baseQueryMeta?.request.method)
  ) {
    addToast({
      color: "success",
      description: (action.payload as any)?.message,
      title: "Ação realizada com sucesso",
    });
  }

  return next(action);
};
