import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Event } from "@mui/icons-material";
import { CourseSession } from "./types";

export interface SessionListProps {
  session: CourseSession[];
  onSessionUpdate: (s: CourseSession[]) => void;
}

const durationOptions = [
  { value: 30, label: "30 minuti" },
  { value: 60, label: "1 ora" },
  { value: 90, label: "1:30 ore" },
  { value: 120, label: "2 ore" },
  { value: 150, label: "2:30 ore" },
  { value: 180, label: "3 ore" },
  { value: 240, label: "4 ore" },
  { value: 300, label: "5 ore" },
  { value: 360, label: "6 ore" },
  { value: 720, label: "12 ore" },
];

const getSessionDuration = (session: CourseSession): number => {
  const durationMinutes = Math.round(
    session.endTime.diff(session.startTime).as("minutes")
  );

  // Find closest duration option
  const closestOption = durationOptions.reduce((prev, curr) => {
    return Math.abs(curr.value - durationMinutes) <
      Math.abs(prev.value - durationMinutes)
      ? curr
      : prev;
  });

  return closestOption.value;
};

export default function SessionList(props: SessionListProps) {
  const { session, onSessionUpdate } = props;

  const handleTimeChange = (sessionIndex: number, newTime: string) => {
    const timeComponents = newTime.split(":").map(Number);

    // Validate time format
    if (timeComponents.length !== 2 || timeComponents.some(isNaN)) return;

    const [hours, minutes] = timeComponents;

    // Use map to create a new array with the updated session
    const updatedSchedule = session.map((session, idx) => {
      if (idx !== sessionIndex) return session;

      const updatedStartTime = session.startTime.set({
        hour: hours,
        minute: minutes,
        second: 0,
        millisecond: 0,
      });

      // Preserve the current duration
      const currentDuration = Math.round(
        session.endTime.diff(session.startTime).as("minutes")
      );

      return {
        ...session,
        startTime: updatedStartTime,
        endTime: updatedStartTime.plus({ minutes: currentDuration }),
      };
    });

    onSessionUpdate(updatedSchedule);
  };

  const handleDurationChange = (
    sessionIndex: number,
    durationMinutes: number
  ) => {
    // Use map to create a new array with the updated session
    const updatedSchedule = session.map((session, idx) =>
      idx === sessionIndex
        ? {
            ...session,
            endTime: session.startTime.plus({ minutes: durationMinutes }),
          }
        : session
    );

    onSessionUpdate(updatedSchedule);
  };

  return (
    <Paper variant="outlined" sx={{ mt: 2 }}>
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          bgcolor: "rgba(0,0,0,0.02)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Event sx={{ mr: 1, color: "primary.main" }} />
          Sessioni programmate ({session.length})
        </Typography>
      </Box>

      {session.length > 0 ? (
        <List disablePadding>
          {session.map((session, index) => (
            <Box key={index}>
              {index > 0 && <Divider />}
              <ListItem
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "medium",
                    minWidth: { sm: "200px" },
                    flex: { sm: "0 0 auto" },
                  }}
                >
                  {session.startTime.toFormat("cccc d LLLL yyyy")}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <TextField
                    label="Orario inizio"
                    type="time"
                    value={session.startTime.toFormat("HH:mm")}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    size="small"
                  />

                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id={`duration-select-label-${index}`}>
                      Durata
                    </InputLabel>
                    <Select
                      labelId={`duration-select-label-${index}`}
                      label="Durata"
                      value={getSessionDuration(session)}
                      onChange={(e) =>
                        handleDurationChange(index, Number(e.target.value))
                      }
                    >
                      {durationOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </ListItem>
            </Box>
          ))}
        </List>
      ) : (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Nessuna sessione programmata. Seleziona una data dal calendario.
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
