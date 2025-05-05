import { Button, Typography, Box, Paper, Alert } from "@mui/material";
import { useSubscribeButton } from "./useSubscribeButton";
import { CourseDto } from "@easymotion/openapi";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

type SubscribeButtonProps = {
  course: CourseDto;
  onSubscribeClick: () => void;
};

export default function SubscribeSection(props: SubscribeButtonProps) {
  const { course, onSubscribeClick } = props;
  const { subscribed, isDisabled, isHidden } = useSubscribeButton({ course });

  if (isHidden) {
    return null;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        mt: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: "primary.dark",
          color: "white",
          py: 1.5,
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <PersonAddAltIcon />
        <Typography variant="h6" component="h3" fontWeight="medium">
          Vuoi partecipare?
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {subscribed ? (
          <Alert
            icon={<AccessTimeIcon />}
            severity="info"
            variant="outlined"
            sx={{
              borderWidth: "1px",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              Risulti già iscritto al corso
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Se il corso non compare ancora tra <b>I miei corsi</b>, la
              richiesta di iscrizione è ancora in fase di approvazione: ritorna
              più tardi.
            </Typography>
          </Alert>
        ) : (
          <>
            {isDisabled && (
              <Alert
                severity="warning"
                variant="outlined"
                icon={<ErrorOutlineIcon />}
                sx={{ mb: 2 }}
              >
                Le iscrizioni al corso sono attualmente chiuse
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isDisabled}
              onClick={onSubscribeClick}
              startIcon={<PersonAddAltIcon />}
              sx={{
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 1.5,
              }}
            >
              Iscriviti al corso
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
}
