import { FormControlLabel, Switch, Stack, Tooltip, Box } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useFormContext } from "react-hook-form";
import type { CourseFormData } from "../schema";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";

interface PublicationStatusSectionProps {
  isPublished: boolean;
  subscriptionsOpen: boolean;
  startDate: DateTime;
  endDate: DateTime;

  onIsPublishedChange: (isPublished: boolean) => void;
  onSubscriptionsOpenChange: (subscriptionsOpen: boolean) => void;
  onStartDateChange: (newStartDate: DateTime | null) => void;
  onEndDateChange: (newEndDate: DateTime | null) => void;
}

export default function PublicationStatusSection() {
  const { watch, setValue } = useFormContext<CourseFormData>();
  const isPublished = watch("is_published");
  const subscriptionsOpen = watch("subscriptions_open");

  return (
    <Box>
      <Stack spacing={3}>
        <Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <VisibilityIcon color={isPublished ? "primary" : "disabled"} />
            <Tooltip title="Se attivato, il corso sarà visibile agli utenti">
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublished}
                    onChange={(e) => setValue("is_published", e.target.checked)}
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
                      setValue("subscriptions_open", e.target.checked)
                    }
                    color="primary"
                  />
                }
                label="Iscrizioni aperte"
              />
            </Tooltip>
          </Stack>
        </Box>

        <Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <HowToRegIcon color={subscriptionsOpen ? "primary" : "disabled"} />
            <Tooltip title="Data inizio iscrizioni">
              <DateTimePicker
                label="Data inizio iscrizioni"
                value={startDate}
                onChange={onStartDateChange}
              />
            </Tooltip>
          </Stack>
        </Box>

        <Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <HowToRegIcon color={subscriptionsOpen ? "primary" : "disabled"} />
            <Tooltip title="Data fine iscrizioni">
              <DateTimePicker
                label="Data fine iscrizioni"
                value={endDate}
                onChange={onEndDateChange}
              />
            </Tooltip>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
