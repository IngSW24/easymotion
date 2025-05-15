import {
  TextField,
  TextFieldProps,
  Box,
  IconButton,
  Paper,
  Tooltip,
  Fade,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import MarkdownBlock from "../MarkdownBlock/MarkdownBlock";

export type MarkdownTextFieldProps = Omit<
  TextFieldProps,
  "value" | "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
};

export default function MarkdownTextField({
  value,
  onChange,
  ...props
}: MarkdownTextFieldProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <Box sx={{ position: "relative" }}>
      {/* Preview button floats in the corner */}
      <Tooltip title={showPreview ? "Modifica" : "Anteprima"}>
        <IconButton
          onClick={() => setShowPreview(!showPreview)}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            "&:hover": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
            },
          }}
        >
          {showPreview ? (
            <VisibilityOff fontSize="small" />
          ) : (
            <Visibility fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      {/* Conditional rendering based on preview */}
      <Fade in={showPreview} timeout={200}>
        <Box sx={{ display: showPreview ? "block" : "none" }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "background.default",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              minHeight: "150px",
            }}
          >
            <MarkdownBlock content={value} />
          </Paper>
        </Box>
      </Fade>

      <Fade in={!showPreview} timeout={200}>
        <Box sx={{ display: !showPreview ? "block" : "none" }}>
          <TextField
            {...props}
            multiline
            minRows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{
              width: "100%",
              "& .MuiInputBase-root": {
                paddingRight: "40px", // Add space for the icon
              },
            }}
          />
        </Box>
      </Fade>
    </Box>
  );
}
