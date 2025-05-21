import { FormControlLabel, Switch, Stack, Tooltip, Box } from "@mui/material";
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
  const isPublished = watch("isPublished");
  const subscriptionsOpen = watch("subscriptionsOpen");
  const subscriptionStartDate = watch("subscriptionStartDate");
  const subscriptionEndDate = watch("subscriptionEndDate");

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
                    onChange={(e) => setValue("isPublished", e.target.checked)}
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
                      setValue("subscriptionsOpen", e.target.checked)
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
              {...register("subscriptionStartDate")}
              label="Data inizio iscrizioni"
              value={DateTime.fromISO(subscriptionStartDate)}
              onChange={(date) => {
                if (date) setValue("subscriptionStartDate", date.toISO() ?? "");
              }}
              slotProps={{
                textField: {
                  error: !!errors.subscriptionStartDate,
                  helperText: errors.subscriptionStartDate?.message,
                },
              }}
              format="dd/MM/yyyy HH:mm"
            />
          </Stack>
        </Box>

        <Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <DateRange color="primary" />
            <DateTimePicker
              {...register("subscriptionEndDate")}
              label="Data fine iscrizioni"
              value={DateTime.fromISO(subscriptionEndDate)}
              onChange={(date) => {
                if (date) setValue("subscriptionEndDate", date.toISO() ?? "");
              }}
              slotProps={{
                textField: {
                  error: !!errors.subscriptionEndDate,
                  helperText: errors.subscriptionEndDate?.message,
                },
              }}
              format="dd/MM/yyyy HH:mm"
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
