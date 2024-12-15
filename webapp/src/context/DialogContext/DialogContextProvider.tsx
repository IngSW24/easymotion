import { ReactNode, useState } from "react";
import { DialogContext, DialogContextProps } from "./DialogContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export interface DialogContextProviderProps {
  children: ReactNode;
}

export default function DialogContextProvider(
  props: DialogContextProviderProps
) {
  const [dialogOptions, setDialogOptions] = useState<DialogContextProps | null>(
    null
  );

  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  // Function to show the confirmation dialog
  const showConfirmationDialog = (
    options: DialogContextProps
  ): Promise<boolean> => {
    setDialogOptions(options); // Set dialog options
    return new Promise((resolve) => {
      setResolvePromise(() => resolve); // Store the resolve function
    });
  };

  // Close the dialog and resolve the promise
  const handleClose = (result: boolean) => {
    setDialogOptions(null);
    if (resolvePromise) {
      resolvePromise(result);
      setResolvePromise(null); // Reset promise
    }
  };

  return (
    <DialogContext.Provider value={{ showConfirmationDialog }}>
      {props.children}

      {/* The dynamically rendered Dialog */}
      {dialogOptions && (
        <Dialog open={!!dialogOptions} onClose={() => handleClose(false)}>
          <DialogTitle>{dialogOptions.title}</DialogTitle>
          <DialogContent>{dialogOptions.content}</DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose(false)}>
              {dialogOptions.cancelText || "Cancel"}
            </Button>
            <Button
              onClick={() => handleClose(true)}
              color="primary"
              variant="contained"
            >
              {dialogOptions.confirmText || "Confirm"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </DialogContext.Provider>
  );
}
