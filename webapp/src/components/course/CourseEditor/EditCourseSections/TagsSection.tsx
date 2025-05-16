import { Box, Chip, TextField } from "@mui/material";
import { useState, KeyboardEvent } from "react";
import { extractTags } from "../../../../utils/format";
import { useFormContext } from "react-hook-form";
import type { CourseFormData } from "../schema";

export default function TagsSection() {
  const { setValue, watch } = useFormContext<CourseFormData>();
  const tags = watch("tags");

  const [inputValue, setInputValue] = useState("");

  const handleDelete = (tagToDelete: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToDelete)
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault();

      const newTags = extractTags(inputValue).filter((x) => !tags.includes(x));

      setValue("tags", [...tags, ...new Set(newTags)]);

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
        {tags.map((tag) => (
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
