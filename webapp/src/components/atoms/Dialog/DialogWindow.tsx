import { ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogProps,
  ButtonProps,
} from "@mui/material";

interface DialogWindowProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  maxWidth?: DialogProps["maxWidth"];
  fullWidth?: boolean;
  disableEscapeKeyDown?: boolean;
  keepMounted?: boolean;

  contentText?: ReactNode;
  children?: ReactNode;

  actions?: ReactNode;
  showCancel?: boolean;
  cancelText?: string;
  showSubmit?: boolean;
  submitText?: string;
  submitColor?: ButtonProps["color"];
  onSubmit?: () => void;
  submitDisabled?: boolean;
}

export default function DialogWindow({
  open,
  onClose,
  title = "",
  maxWidth = "xs",
  fullWidth = true,
  disableEscapeKeyDown = true,
  keepMounted = true,
  contentText,
  children,
  actions,
  showCancel = true,
  cancelText = "Annulla",
  showSubmit = true,
  submitText = "Conferma",
  submitColor = "primary",
  onSubmit,
  submitDisabled = false,
}: DialogWindowProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableEscapeKeyDown={disableEscapeKeyDown}
      keepMounted={keepMounted}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      {title && <DialogTitle>{title}</DialogTitle>}

      <DialogContent>
        {contentText && <DialogContentText>{contentText}</DialogContentText>}
        {children}
      </DialogContent>

      {(actions || showCancel || showSubmit) && (
        <DialogActions>
          {actions ? (
            actions
          ) : (
            <>
              {showCancel && <Button onClick={onClose}>{cancelText}</Button>}
              {showSubmit && (
                <Button
                  onClick={onSubmit}
                  variant="contained"
                  color={submitColor}
                  disabled={submitDisabled}
                >
                  {submitText}
                </Button>
              )}
            </>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}

{
  /** 
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

interface DialogWindowProps {
  open: boolean;
  onClose: () => void;
  categoryName: string;
  onCategoryNameChange: (value: string) => void;
  onCreateCategory: () => void;
}

export default function DialogWindow({
  open,
  onClose,
  categoryName,
  onCategoryNameChange,
  onCreateCategory,
}: DialogWindowProps) {
  return (
    <Dialog open={open} onClose={onClose} disableEscapeKeyDown keepMounted>
      <DialogTitle>Aggiungi nuova categoria</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Inserisci il nome della nuova categoria
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Nome categoria"
          fullWidth
          value={categoryName}
          onChange={(e) => onCategoryNameChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button onClick={onCreateCategory}>Aggiungi</Button>
      </DialogActions>
    </Dialog>
  );
}
*/
}
