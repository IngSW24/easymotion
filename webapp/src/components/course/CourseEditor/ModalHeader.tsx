import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
  Tooltip,
} from "@mui/material";
import { ArrowBack, Save, CreateOutlined } from "@mui/icons-material";
import { CourseDto } from "@easymotion/openapi";

interface ModalHeaderProps {
  course?: CourseDto;
  isPending: boolean;
  isFormValid: boolean;
  onClose: () => void;
  onSubmit: () => void;
  tooltipMessage: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  course,
  isPending,
  isFormValid,
  onClose,
  onSubmit,
  tooltipMessage,
}) => {
  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={1}
      sx={{
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        bgcolor: "background.paper",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ ml: 2, flex: 1, display: "flex", alignItems: "center" }}
        >
          <CreateOutlined sx={{ mr: 1 }} />{" "}
          {course ? "Modifica corso" : "Crea nuovo corso"}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title={tooltipMessage} placement="bottom-start" arrow>
            <span>
              {" "}
              {/* Wrapper needed for disabled button tooltip */}
              <Button
                onClick={onSubmit}
                variant="contained"
                color="primary"
                disabled={isPending || !isFormValid}
                startIcon={<Save />}
              >
                {isPending
                  ? course
                    ? "Aggiornamento in corso..."
                    : "Creazione in corso..."
                  : course
                    ? "Aggiorna corso"
                    : "Crea corso"}
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(ModalHeader);
