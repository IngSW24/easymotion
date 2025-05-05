import { Box } from "@mui/material";
import Markdown from "react-markdown";

export interface MarkdownBlockProps {
  content: string | null | undefined;
}

export default function MarkdownBlock(props: MarkdownBlockProps) {
  return (
    <Box
      sx={{
        "& p": { mb: 2 },
        "& p:last-child": { mb: 0 },
        "& ul, & ol": { pl: 3, mb: 2 },
        "& li": { mb: 1 },
        "& h1, & h2, & h3, & h4, & h5, & h6": { mt: 3, mb: 2 },
        "& a": {
          color: "primary.dark",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
            color: "primary.main",
          },
        },
      }}
    >
      <Markdown>{props.content}</Markdown>
    </Box>
  );
}
