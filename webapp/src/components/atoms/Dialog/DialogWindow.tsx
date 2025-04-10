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
