import { useSnackbar } from "notistack";
import { useCallback } from "react";

type ErrorResponse = { error: { error: string; message: string[] } };

type ErrorType = Error | string | ErrorResponse;

const isError = (e: ErrorType): e is Error => e instanceof Error;
const isResponse = (e: ErrorType): e is ErrorResponse =>
  Object.keys(e).includes("error");

const getMessage = (e: ErrorType) => {
  if (isError(e)) {
    return `An error occurred: ${e.message}`;
  }
  if (isResponse(e)) {
    return `An error occurred: ${e.error.error}: ${e.error.message.join(", ")}`;
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
