import { useSnackbar } from "notistack";
import { useCallback } from "react";

const isError = (e: Error | string): e is Error => e instanceof Error;

export const useSnack = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showError = useCallback(
    (e: Error | string) => {
      const msg = isError(e) ? `An error occoured: ${e.message}` : e;
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
