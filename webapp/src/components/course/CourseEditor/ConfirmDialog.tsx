import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { PriorityHigh } from "@mui/icons-material";

interface ConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PriorityHigh color="error" sx={{ mr: 1 }} />
          Sei sicuro di voler annullare?
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Tutte le modifiche non salvate andranno perse.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="text" color="inherit">
          Continua
        </Button>
        <Button onClick={onConfirm} variant="contained" autoFocus>
          Esci
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(ConfirmDialog);
