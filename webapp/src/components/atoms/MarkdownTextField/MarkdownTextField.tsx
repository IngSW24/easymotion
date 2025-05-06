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

export type MarkdownTextFieldProps = TextFieldProps & {
  previewValue?: string;
};

export default function MarkdownTextField(props: MarkdownTextFieldProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
        <Fade in={showPreview} timeout={200}>
          <Box sx={{ flex: 1, display: showPreview ? "block" : "none" }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "background.default",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                minHeight: "150px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: "0 0 0 1px",
                },
              }}
            >
              <MarkdownBlock content={props.previewValue || ""} />
            </Paper>
          </Box>
        </Fade>
        <Fade in={!showPreview} timeout={200}>
          <Box sx={{ flex: 1, display: !showPreview ? "block" : "none" }}>
            <TextField
              {...props}
              multiline
              minRows={4}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  },
                },
              }}
            />
          </Box>
        </Fade>
        <Tooltip title={showPreview ? "Modifica" : "Anteprima"}>
          <IconButton
            onClick={() => setShowPreview(!showPreview)}
            sx={{
              mt: 1,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
              },
            }}
          >
            {showPreview ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
