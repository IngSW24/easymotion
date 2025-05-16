import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useState, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch";
import SearchResults from "./SearchResults";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults, isLoading } = useDebouncedSearch({
    query,
  });

  const handleDialogEntered = () => {
    searchInputRef.current?.focus();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        transition: {
          onEntered: handleDialogEntered,
        },
        paper: {
          sx: {
            height: "80vh", // Fixed height
            boxShadow: (theme) => theme.shadows[24],
            borderRadius: 2,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: (theme) => theme.palette.primary.main,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
            },
          },
        },
      }}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}>
        <TextField
          inputRef={searchInputRef}
          fullWidth
          placeholder="Cerca fisioterapisti o corsi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="standard"
          slotProps={{
            input: {
              disableUnderline: true,
              sx: {
                fontSize: "1.2rem",
                "&:focus": {
                  outline: "none",
                },
              },
            },
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
      <DialogContent
        dividers
        sx={{
          height: "calc(100% - 64px)", // Subtract the height of the DialogTitle
          overflow: "auto",
        }}
      >
        <SearchResults
          results={searchResults?.data}
          isLoading={isLoading}
          onResultClick={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
