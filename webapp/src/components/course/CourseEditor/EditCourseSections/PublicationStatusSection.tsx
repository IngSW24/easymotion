import {
  Typography,
  FormControlLabel,
  Switch,
  Stack,
  Tooltip,
  Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HowToRegIcon from "@mui/icons-material/HowToReg";

interface PublicationStatusSectionProps {
  isPublished: boolean;
  subscriptionsOpen: boolean;
  onIsPublishedChange: (isPublished: boolean) => void;
  onSubscriptionsOpenChange: (subscriptionsOpen: boolean) => void;
}

export default function PublicationStatusSection({
  isPublished,
  subscriptionsOpen,
  onIsPublishedChange,
  onSubscriptionsOpenChange,
}: PublicationStatusSectionProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Stato del corso
      </Typography>

      <Stack spacing={3}>
        <Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <VisibilityIcon color={isPublished ? "primary" : "disabled"} />
            <Tooltip title="Se attivato, il corso sarà visibile agli utenti">
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublished}
                    onChange={(e) => onIsPublishedChange(e.target.checked)}
                    color="primary"
                  />
                }
                label="Corso pubblicato"
              />
            </Tooltip>
          </Stack>
        </Box>

        <Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <HowToRegIcon color={subscriptionsOpen ? "primary" : "disabled"} />
            <Tooltip title="Se attivato, gli utenti potranno iscriversi al corso">
              <FormControlLabel
                control={
                  <Switch
                    checked={subscriptionsOpen}
                    onChange={(e) =>
                      onSubscriptionsOpenChange(e.target.checked)
                    }
                    color="primary"
                  />
                }
                label="Iscrizioni aperte"
              />
            </Tooltip>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
