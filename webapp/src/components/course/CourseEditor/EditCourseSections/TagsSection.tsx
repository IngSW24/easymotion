import { Box, Chip, TextField } from "@mui/material";
import { useState, KeyboardEvent } from "react";
import { extractTags } from "../../../../utils/format";

export interface TagsSectionProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsSection(props: TagsSectionProps) {
  const { value, onChange } = props;

  const [inputValue, setInputValue] = useState("");

  const handleDelete = (tagToDelete: string) => {
    onChange(value.filter((tag) => tag !== tagToDelete));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault();

      const tags = extractTags(inputValue).filter((x) => !value.includes(x));

      onChange([...value, ...new Set(tags)]);

      setInputValue("");
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Aggiungi uno o più tag separati da spazi"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="forza resistenza miglioramento"
        helperText="Premere invio per aggiungere"
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
