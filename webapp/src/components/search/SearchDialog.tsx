import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch";
import SearchResults from "./SearchResults";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");

  const { data: searchResults, isLoading } = useDebouncedSearch({
    query,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          minHeight: "60vh",
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          placeholder="Cerca fisioterapisti o corsi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="standard"
          autoFocus
          InputProps={{
            disableUnderline: true,
          }}
          sx={{ mr: 2 }}
        />
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <SearchResults
          results={searchResults?.data}
          isLoading={isLoading}
          onResultClick={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
