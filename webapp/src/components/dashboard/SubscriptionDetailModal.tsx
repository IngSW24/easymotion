import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { SubscriptionDtoWithUser } from "@easymotion/openapi";

export interface SubscriptionDetailsProps {
  courseId?: string;
  userId?: string;
  subscription?: SubscriptionDtoWithUser;
  open: boolean;
  setOpen: (s: boolean) => void;
  onAccept?: (userId: string) => void;
  onDecline?: (userId: string) => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "75%", md: "60%" },
  maxWidth: "600px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
  borderRadius: 1,
  maxHeight: "calc(100vh - 100px)",
  overflowY: "auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

export default function SubscriptionDetailsModal(
  props: SubscriptionDetailsProps
) {
  const { subscription, open, setOpen, onAccept, onDecline } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const confirmSubscription = (userId: string) => {
    if (onAccept) {
      onAccept(userId);
    }
    handleClose();
  };

  const denySubscription = (userId: string) => {
    if (onDecline) {
      onDecline(userId);
    }
    handleClose();
  };

  if (!subscription) {
    return null;
  }

  const { user, course, subscriptionRequestMessage } = subscription;
  const fullName = `${user.firstName} ${user.middleName ? user.middleName + " " : ""}${user.lastName}`;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="subscription-details-title"
    >
      <Box sx={style}>
        <Box sx={headerStyle}>
          <Typography
            id="subscription-details-title"
            variant="h6"
            component="h2"
          >
            Richiesta di iscrizione
          </Typography>
          <IconButton aria-label="close" onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <strong>Corso:</strong> {course.name}
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <strong>Utente:</strong> {fullName}
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <strong>Email:</strong> {user.email}
        </Typography>

        {subscriptionRequestMessage && (
          <Box sx={{ mb: 3, mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Messaggio:</strong>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                p: 2,
                bgcolor: "grey.100",
                borderRadius: 1,
              }}
            >
              {subscriptionRequestMessage}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            mt: 3,
            gap: 2,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<Check />}
            onClick={() => confirmSubscription(user.id)}
          >
            Accetta
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Close />}
            onClick={() => denySubscription(user.id)}
          >
            Rifiuta
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
