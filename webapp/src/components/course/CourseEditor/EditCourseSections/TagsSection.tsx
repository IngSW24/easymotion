import React from "react";
import { Box, Typography } from "@mui/material";
import LocalOffer from "@mui/icons-material/LocalOffer";
import TagsInput from "../TagsInput";

interface TagsSectionProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagsSection: React.FC<TagsSectionProps> = ({ tags, onTagsChange }) => (
  <Box>
    <Typography
      variant="h6"
      sx={{ display: "flex", alignItems: "center", mb: 2 }}
    >
      <LocalOffer sx={{ mr: 1 }} /> Tags
    </Typography>
    <TagsInput value={tags} onChange={onTagsChange} />
  </Box>
);

export default React.memo(TagsSection);
