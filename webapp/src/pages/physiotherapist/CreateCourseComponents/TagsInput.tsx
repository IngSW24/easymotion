import { Box, Chip, TextField } from "@mui/material";
import { useState, KeyboardEvent } from "react";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsInput({ value, onChange }: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleDelete = (tagToDelete: string) => {
    onChange(value.filter((tag) => tag !== tagToDelete));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault();

      const tags = inputValue
        .trim()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .split(" ")
        .filter((x) => x !== "")
        .filter((x) => !value.includes(x));

      onChange([...value, ...new Set(tags)]);

      setInputValue("");
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Aggiungi tags"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Premi enter per aggiungere"
        helperText="Premi Enter per aggiungere un tag"
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
        {value.map((tag) => (
          <Chip
            key={tag}
            label={`#${tag}`}
            onDelete={() => handleDelete(tag)}
            color="primary"
          />
        ))}
      </Box>
    </Box>
  );
}
