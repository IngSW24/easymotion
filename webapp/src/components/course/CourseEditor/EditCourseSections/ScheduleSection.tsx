import { useCallback, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
} from "@mui/material";
import { DateTime } from "luxon";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import RepeatIcon from "@mui/icons-material/Repeat";
import { useFormContext, useFieldArray } from "react-hook-form";
import type { CourseFormData } from "../schema";
import { calculateDuration } from "../../../../utils/format";

type SessionFormState = {
  date: DateTime | null;
  startTime: DateTime | null;
  endTime: DateTime | null;
};

type RecurringSessionFormState = {
  startDate: DateTime | null;
  startTime: DateTime | null;
  endTime: DateTime | null;
  frequency: "weekly" | "biweekly" | "monthly";
  count: number;
};

export default function ScheduleSection() {
  const { control, setValue, watch } = useFormContext<CourseFormData>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "sessions",
  });

  const courseId = watch("id");

  const [open, setOpen] = useState(false);
  const [recurringOpen, setRecurringOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [sessionForm, setSessionForm] = useState<SessionFormState>({
    date: null,
    startTime: null,
    endTime: null,
  });
  const [recurringForm, setRecurringForm] = useState<RecurringSessionFormState>(
    {
      startDate: DateTime.now().set({
        hour: 9,
        minute: 0,
        second: 0,
        millisecond: 0,
      }),
      startTime: DateTime.now().set({
        hour: 9,
        minute: 0,
        second: 0,
        millisecond: 0,
      }),
      endTime: DateTime.now().set({
        hour: 10,
        minute: 0,
        second: 0,
        millisecond: 0,
      }),
      frequency: "weekly",
      count: 4,
    }
  );
  const [errors, setErrors] = useState<{
    date?: string;
    startTime?: string;
    endTime?: string;
  }>({});
  const [recurringErrors, setRecurringErrors] = useState<{
    startDate?: string;
    startTime?: string;
    endTime?: string;
    count?: string;
  }>({});

  const formatDate = (date: DateTime) => date.toFormat("dd/MM/yyyy HH:mm");

  const combineDateTime = (date: DateTime, time: DateTime): DateTime =>
    date.set({
      hour: time.hour,
      minute: time.minute,
      second: 0,
      millisecond: 0,
    });

  const handleRemoveSession = (index: number) => remove(index);

  const handleClose = () => setOpen(false);

  const handleRecurringOpen = () => setRecurringOpen(true);

  const handleRecurringClose = () => setRecurringOpen(false);

  const handleAddClick = useCallback(() => {
    setIsEditing(false);
    setEditingIndex(null);

    const today = DateTime.now().set({
      hour: 9,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const oneHourLater = today.set({ hour: 10 });

    setSessionForm({
      date: today,
      startTime: today,
      endTime: oneHourLater,
    });
    setErrors({});
    setOpen(true);
  }, []);

  const handleEditClick = useCallback(
    (index: number) => {
      setIsEditing(true);
      setEditingIndex(index);

      const session = fields[index];
      const startTime = DateTime.fromISO(session.startTime);
      const endTime = DateTime.fromISO(session.endTime);

      setSessionForm({
        date: startTime,
        startTime: startTime,
        endTime: endTime,
      });
      setErrors({});
      setOpen(true);
    },
    [fields]
  );

  const validateSession = useCallback(() => {
    const newErrors: {
      date?: string;
      startTime?: string;
      endTime?: string;
    } = {};

    if (!sessionForm.date) {
      newErrors.date = "La data è obbligatoria";
    }

    if (!sessionForm.startTime) {
      newErrors.startTime = "L'ora di inizio è obbligatoria";
    }

    if (!sessionForm.endTime) {
      newErrors.endTime = "L'ora di fine è obbligatoria";
    }

    if (sessionForm.startTime && sessionForm.endTime) {
      if (sessionForm.endTime < sessionForm.startTime) {
        newErrors.endTime =
          "L'ora di fine deve essere successiva all'ora di inizio";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [sessionForm.date, sessionForm.endTime, sessionForm.startTime]);

  const validateRecurringForm = useCallback(() => {
    const newErrors: {
      startDate?: string;
      startTime?: string;
      endTime?: string;
      count?: string;
    } = {};

    if (!recurringForm.startDate) {
      newErrors.startDate = "La data di inizio è obbligatoria";
    }

    if (!recurringForm.startTime) {
      newErrors.startTime = "L'ora di inizio è obbligatoria";
    }

    if (!recurringForm.endTime) {
      newErrors.endTime = "L'ora di fine è obbligatoria";
    }

    if (recurringForm.count < 1) {
      newErrors.count = "Il numero di sessioni deve essere almeno 1";
    }

    // Check if end time is after start time
    if (recurringForm.startTime && recurringForm.endTime) {
      if (recurringForm.endTime < recurringForm.startTime) {
        newErrors.endTime =
          "L'ora di fine deve essere successiva all'ora di inizio";
      }
    }

    setRecurringErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    recurringForm.startDate,
    recurringForm.startTime,
    recurringForm.endTime,
    recurringForm.count,
  ]);

  // Helper to combine date and time into a single DateTime

  const handleSaveSession = useCallback(() => {
    if (!validateSession()) return;

    if (sessionForm.date && sessionForm.startTime && sessionForm.endTime) {
      const startDateTime = combineDateTime(
        sessionForm.date,
        sessionForm.startTime
      );
      const endDateTime = combineDateTime(
        sessionForm.date,
        sessionForm.endTime
      );

      if (isEditing && editingIndex !== null) {
        // Update existing session
        update(editingIndex, {
          startTime: startDateTime.toISO() ?? "",
          endTime: endDateTime.toISO() ?? "",
        });
      } else {
        // Add new session
        append({
          startTime: startDateTime.toISO() ?? "",
          endTime: endDateTime.toISO() ?? "",
        });
      }

      setOpen(false);
    }
  }, [isEditing, editingIndex, sessionForm, validateSession, append, update]);

  const handleCreateRecurringSessions = useCallback(() => {
    if (!validateRecurringForm()) return;

    if (
      recurringForm.startDate &&
      recurringForm.startTime &&
      recurringForm.endTime
    ) {
      const { startDate, startTime, endTime, frequency, count } = recurringForm;
      const newSessions: { startTime: string; endTime: string }[] = [];

      // Get the duration between start and end time
      const duration = endTime.diff(startTime, ["hours", "minutes"]);

      for (let i = 0; i < count; i++) {
        let sessionDate: DateTime;

        // Calculate the date based on frequency
        if (frequency === "weekly") {
          sessionDate = startDate.plus({ weeks: i });
        } else if (frequency === "biweekly") {
          sessionDate = startDate.plus({ weeks: i * 2 });
        } else {
          // monthly
          sessionDate = startDate.plus({ months: i });
        }

        // Create the session with the proper start and end times
        const sessionStartTime = sessionDate.set({
          hour: startTime.hour,
          minute: startTime.minute,
          second: 0,
          millisecond: 0,
        });

        const sessionEndTime = sessionStartTime.plus({
          hours: duration.hours,
          minutes: duration.minutes,
        });

        newSessions.push({
          startTime: sessionStartTime.toISO() ?? "",
          endTime: sessionEndTime.toISO() ?? "",
        });
      }

      // Replace all current sessions with these new ones
      setValue("sessions", newSessions);
      setRecurringOpen(false);
    }
  }, [validateRecurringForm, recurringForm, setValue]);

  const handleRecurringCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      setRecurringForm((prev) => ({
        ...prev,
        count: isNaN(value) ? 1 : Math.max(1, value),
      }));
    },
    []
  );

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Stack spacing={2}>
          {fields.length > 0 ? (
            fields.map((field, index) => {
              const startTime = DateTime.fromISO(field.startTime);
              const endTime = DateTime.fromISO(field.endTime);

              return (
                <Paper key={field.id} elevation={1} sx={{ p: 2 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {formatDate(startTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Durata: {calculateDuration(startTime, endTime)}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        onClick={() => handleEditClick(index)}
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleRemoveSession(index)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              );
            })
          ) : (
            <Typography color="text.secondary" align="center">
              Nessun appuntamento programmato
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              variant="outlined"
            >
              Aggiungi appuntamento
            </Button>

            <Button
              startIcon={<RepeatIcon />}
              onClick={handleRecurringOpen}
              variant="outlined"
              color="secondary"
              disabled={courseId !== undefined}
            >
              Crea sessioni ricorrenti
            </Button>
          </Box>
        </Stack>
      </Grid>

      {/* Single session dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        PaperProps={{
          sx: { width: "100%", maxWidth: "360px" },
        }}
      >
        <DialogTitle>
          {isEditing ? "Modifica appuntamento" : "Aggiungi nuovo appuntamento"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <DatePicker
              label="Data"
              value={sessionForm.date}
              onChange={(newValue) =>
                setSessionForm({ ...sessionForm, date: newValue })
              }
              formatDensity="spacious"
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  error: !!errors.date,
                  helperText: errors.date,
                  fullWidth: true,
                },
              }}
            />
            <TimePicker
              label="Ora di inizio"
              value={sessionForm.startTime}
              onChange={(newValue) =>
                setSessionForm({ ...sessionForm, startTime: newValue })
              }
              ampm={false}
              slotProps={{
                textField: {
                  error: !!errors.startTime,
                  helperText: errors.startTime,
                  fullWidth: true,
                },
              }}
            />
            <TimePicker
              label="Ora di fine"
              value={sessionForm.endTime}
              onChange={(newValue) =>
                setSessionForm({ ...sessionForm, endTime: newValue })
              }
              ampm={false}
              slotProps={{
                textField: {
                  error: !!errors.endTime,
                  helperText: errors.endTime,
                  fullWidth: true,
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annulla</Button>
          <Button onClick={handleSaveSession} variant="contained">
            {isEditing ? "Salva" : "Aggiungi"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Recurring sessions dialog */}
      <Dialog
        open={recurringOpen}
        onClose={handleRecurringClose}
        maxWidth="xs"
        PaperProps={{
          sx: { width: "100%", maxWidth: "360px" },
        }}
      >
        <DialogTitle>Crea sessioni ricorrenti</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <DatePicker
              label="Data di inizio"
              value={recurringForm.startDate}
              onChange={(newValue) =>
                setRecurringForm({ ...recurringForm, startDate: newValue })
              }
              formatDensity="spacious"
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  error: !!recurringErrors.startDate,
                  helperText: recurringErrors.startDate,
                  fullWidth: true,
                },
              }}
            />
            <TimePicker
              label="Ora di inizio"
              value={recurringForm.startTime}
              onChange={(newValue) =>
                setRecurringForm({ ...recurringForm, startTime: newValue })
              }
              ampm={false}
              slotProps={{
                textField: {
                  error: !!recurringErrors.startTime,
                  helperText: recurringErrors.startTime,
                  fullWidth: true,
                },
              }}
            />
            <TimePicker
              label="Ora di fine"
              value={recurringForm.endTime}
              onChange={(newValue) =>
                setRecurringForm({ ...recurringForm, endTime: newValue })
              }
              ampm={false}
              slotProps={{
                textField: {
                  error: !!recurringErrors.endTime,
                  helperText: recurringErrors.endTime,
                  fullWidth: true,
                },
              }}
            />

            <Divider sx={{ my: 1 }}>Ricorrenza</Divider>

            <FormControl fullWidth>
              <InputLabel id="frequency-label">Frequenza</InputLabel>
              <Select
                labelId="frequency-label"
                value={recurringForm.frequency}
                label="Frequenza"
                onChange={(e) =>
                  setRecurringForm({
                    ...recurringForm,
                    frequency: e.target.value as
                      | "weekly"
                      | "biweekly"
                      | "monthly",
                  })
                }
              >
                <MenuItem value="weekly">Settimanale</MenuItem>
                <MenuItem value="biweekly">Bisettimanale</MenuItem>
                <MenuItem value="monthly">Mensile</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Numero di sessioni"
              type="number"
              value={recurringForm.count}
              onChange={handleRecurringCountChange}
              fullWidth
              inputProps={{ min: 1 }}
              error={!!recurringErrors.count}
              helperText={recurringErrors.count}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRecurringClose}>Annulla</Button>
          <Button onClick={handleCreateRecurringSessions} variant="contained">
            Crea sessioni
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
