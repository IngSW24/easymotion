import { useState } from "react";
import {
  TextField,
  Box,
  IconButton,
  Typography,
  InputAdornment,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

type CrudSelectorEntry = {
  id: string;
  name: string;
};

interface CrudSelectorProps {
  label: string;
  items: CrudSelectorEntry[];
  value: CrudSelectorEntry | null;
  onChange: (value: CrudSelectorEntry | null) => void;
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  error?: boolean;
  helperText?: string;
  disableClear?: boolean;
}

const sanitizeString = (str: string) => {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
};

const compareStrings = (str1: string, str2: string) => {
  return sanitizeString(str1) === sanitizeString(str2);
};

export default function CrudSelector(props: CrudSelectorProps) {
  const {
    label,
    items,
    value,
    onChange,
    onAdd,
    onRemove,
    error,
    helperText,
    disableClear = false,
  } = props;

  const [inputValue, setInputValue] = useState("");

  const handleAddClick = () => {
    const currentValue = inputValue.trim();

    if (!currentValue) return;

    if (items.find((item) => compareStrings(item.name, currentValue))) return;

    onAdd(currentValue);
    setInputValue("");
  };

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      disableClearable={disableClear}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      options={items}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Typography flexGrow={1}>{option.name}</Typography>
          <IconButton
            edge="end"
            size="small"
            onClick={(e) => {
              e.stopPropagation(); // prevent selection of the option
              onRemove(option.id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          fullWidth
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd(inputValue);
            }
          }}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleAddClick}
                      edge="end"
                      disabled={!inputValue.trim()}
                    >
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}
