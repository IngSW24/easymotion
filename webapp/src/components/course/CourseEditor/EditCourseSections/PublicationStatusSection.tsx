import {
  FormControlLabel,
  Switch,
  Stack,
  Tooltip,
  Box,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useFormContext } from "react-hook-form";
import type { CourseFormData } from "../schema";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { DateRange } from "@mui/icons-material";

export default function PublicationStatusSection() {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<CourseFormData>();
  const isPublished = watch("is_published");
  const subscriptionsOpen = watch("subscriptions_open");
  const subscriptionStartDate = watch("subscription_start_date");
  const subscriptionEndDate = watch("subscription_end_date");

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
            <DateRange color="primary" />
            <DateTimePicker
              {...register("subscription_start_date")}
              label="Data inizio iscrizioni"
              value={DateTime.fromISO(subscriptionStartDate)}
              onChange={(date) => {
                if (date)
                  setValue("subscription_start_date", date.toISO() ?? "");
              }}
              slotProps={{
                textField: {
                  error: !!errors.subscription_start_date,
                  helperText: errors.subscription_start_date?.message,
                },
              }}
            />
          </Stack>
        </Box>

        <Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <DateRange color="primary" />
            <DateTimePicker
              {...register("subscription_end_date")}
              label="Data fine iscrizioni"
              value={DateTime.fromISO(subscriptionEndDate)}
              onChange={(date) => {
                if (date) setValue("subscription_end_date", date.toISO() ?? "");
              }}
              slotProps={{
                textField: {
                  error: !!errors.subscription_end_date,
                  helperText: errors.subscription_end_date?.message,
                },
              }}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
