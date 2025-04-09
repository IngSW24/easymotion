import { Add } from "@mui/icons-material";
import { Button, Drawer, Modal, Typography } from "@mui/material";

export interface CourseUsersListModalProps {
  open: boolean;
  onClose: () => void;
  courseId?: string;
}

export default function CourseUsersListModal(props: CourseUsersListModalProps) {
  const { open, onClose, courseId } = props;

  if (!courseId) {
    <Typography>Error ....</Typography>;
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      variant="temporary"
      onClose={(_event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
      ModalProps={{
        keepMounted: false,
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: "90%", md: "80%", lg: "70%" },
          boxSizing: "border-box",
          bgcolor: "#f5f7fa",
        },
      }}
    >
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        size="small"
        onClick={() => onClose()}
      >
        Chiudi
      </Button>
      <Typography>ID corso: {courseId}</Typography>
    </Drawer>
  );
}
