import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { isHttpResponseError } from "../data/guards";
import { HttpResponse } from "@easymotion/openapi";

type ErrorType = Error | string | HttpResponse<unknown, Error> | unknown;

const isError = (e: ErrorType): e is Error => e instanceof Error;

const getMessage = (e: ErrorType) => {
  if (isError(e)) {
    return `An error occurred: ${e.message}`;
  }
  if (isHttpResponseError(e)) {
    return `An error occurred: ${e.error.message}`;
  }
  return `An error occurred: ${e}`;
};

export const useSnack = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showError = useCallback(
    (e: ErrorType) => {
      const msg = getMessage(e);
      enqueueSnackbar(msg, {
        autoHideDuration: 3500,
        variant: "error",
      });
    },
    [enqueueSnackbar]
  );

  const showSuccess = useCallback(
    (message: string) => {
      enqueueSnackbar(message, {
        variant: "success",
        autoHideDuration: 3000,
      });
    },
    [enqueueSnackbar]
  );

  return { showError, showSuccess };
};
