import React from "react";
import { Box, Typography } from "@mui/material";
import { PriorityHigh } from "@mui/icons-material";
import SessionBuilder from "../SessionBuilder/SessionBuilder";
import { CourseSession } from "../SessionBuilder/types";

interface ScheduleSectionProps {
  sessions: CourseSession[];
  errors: {
    schedule?: string;
  };
  onScheduleChange: (sessions: CourseSession[]) => void;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  sessions,
  errors,
  onScheduleChange,
}) => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        Calendario
      </Typography>
      <SessionBuilder
        initialSession={sessions}
        onScheduleChange={onScheduleChange}
      />
      {errors.schedule && (
        <Typography
          color="error"
          variant="caption"
          sx={{ display: "flex", alignItems: "center", mt: 1 }}
        >
          <PriorityHigh fontSize="small" sx={{ mr: 0.5 }} />
          {errors.schedule}
        </Typography>
      )}
    </Box>
  );
};

export default React.memo(ScheduleSection);
