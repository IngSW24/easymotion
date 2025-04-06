import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  DateCalendar,
  MultiSectionDigitalClock,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useEffect, useState, useRef } from "react";
import { Edit } from "@mui/icons-material";

// Custom styled PickersDay to handle multiple selections
import { styled } from "@mui/material/styles";

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop: string) => prop !== "isSelected",
})<PickersDayProps<DateTime> & { isSelected?: boolean }>(
  ({ theme, isSelected }) => ({
    ...(isSelected && {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      "&:hover, &:focus": {
        backgroundColor: theme.palette.primary.dark,
      },
      borderTopLeftRadius: "50%",
      borderBottomLeftRadius: "50%",
      borderTopRightRadius: "50%",
      borderBottomRightRadius: "50%",
    }),
  })
);

interface SchedulePickerProps {
  value: string[];
  onChange: (schedule: string[]) => void;
}

export default function SchedulePicker({
  value,
  onChange,
}: SchedulePickerProps) {
  // Basic settings
  const [scheduleType, setScheduleType] = useState<"single" | "recurring">(
    "single"
  );
  const [sessionCount, setSessionCount] = useState<number>(2);
  const [repeatFrequency, setRepeatFrequency] = useState<"weekly" | "monthly">(
    "weekly"
  );

  // Date management
  const [selectedDates, setSelectedDates] = useState<DateTime[]>([
    DateTime.now(),
  ]);
  const [singleDate, setSingleDate] = useState<DateTime>(DateTime.now());

  // Time settings
  const [startTime, setStartTime] = useState<DateTime>(
    DateTime.now().set({ hour: 9, minute: 0 })
  );
  const [endTime, setEndTime] = useState<DateTime>(
    DateTime.now().set({ hour: 10, minute: 0 })
  );

  // Edit mode
  const [editMode, setEditMode] = useState<boolean>(false);
  const hasManualEdits = useRef<boolean>(false);

  // Initialize from props
  useEffect(() => {
    if (value.length === 0) return;

    try {
      const parsedDates = value.map((dateStr) => {
        const [start] = dateStr.split("|");
        return DateTime.fromISO(start).startOf("day");
      });

      if (parsedDates.length > 0) {
        setSelectedDates(parsedDates);
        setSingleDate(parsedDates[0]);

        if (parsedDates.length > 1) {
          setScheduleType("recurring");
          setSessionCount(parsedDates.length);

          const firstDate = parsedDates[0];
          const secondDate = parsedDates[1];
          const diffDays = secondDate.diff(firstDate, "days").days;

          setRepeatFrequency(
            diffDays >= 25 && diffDays <= 35 ? "monthly" : "weekly"
          );
        }
      }
    } catch (e) {
      console.error("Failed to parse schedule dates", e);
    }
  }, []); // Only on initial mount

  // Generate schedule dates based on parameters
  function generateSchedule(
    baseDate: DateTime,
    count: number,
    frequency: "weekly" | "monthly"
  ): DateTime[] {
    if (count <= 0) return [];

    const dates = [baseDate.startOf("day")];
    for (let i = 1; i < count; i++) {
      if (frequency === "weekly") {
        dates.push(baseDate.plus({ weeks: i }).startOf("day"));
      } else {
        dates.push(baseDate.plus({ months: i }).startOf("day"));
      }
    }
    return dates;
  }

  // Format selected dates for API
  function formatDatesToApi(dates: DateTime[]): string[] {
    return dates.map((date) => {
      const start = date.set({
        hour: startTime.hour,
        minute: startTime.minute,
      });

      const end = date.set({
        hour: endTime.hour,
        minute: endTime.minute,
      });

      return `${start.toISO()}|${end.toISO()}`;
    });
  }

  // Handle schedule type change (single/recurring)
  function handleScheduleTypeChange(newType: "single" | "recurring") {
    if (newType === scheduleType) return;

    setEditMode(false);
    hasManualEdits.current = false;

    if (newType === "single") {
      // Use the first date when switching to single
      const firstDate =
        selectedDates.length > 0 ? selectedDates[0] : DateTime.now();
      setSingleDate(firstDate);
      setSelectedDates([firstDate]);
    } else {
      // Generate a recurring schedule based on the single date
      if (sessionCount < 2) setSessionCount(2);
      const baseDate = selectedDates[0] || DateTime.now();
      const newDates = generateSchedule(
        baseDate,
        sessionCount,
        repeatFrequency
      );
      setSelectedDates(newDates);
    }

    setScheduleType(newType);
  }

  // Handle changes to recurring schedule parameters
  function handleScheduleParamsChange() {
    if (scheduleType !== "recurring" || editMode || hasManualEdits.current)
      return;

    const baseDate =
      selectedDates.length > 0 ? selectedDates[0] : DateTime.now();
    const newDates = generateSchedule(baseDate, sessionCount, repeatFrequency);
    setSelectedDates(newDates);
  }

  // Handle single date change in calendar
  function handleSingleDateChange(newDate: DateTime | null) {
    if (!newDate) return;

    setSingleDate(newDate);
    setSelectedDates([newDate.startOf("day")]);

    // Update API
    onChange(formatDatesToApi([newDate.startOf("day")]));
  }

  // Check if a date is in the selected dates
  function isDateSelected(date: DateTime): boolean {
    return selectedDates.some(
      (d) =>
        d.hasSame(date, "day") &&
        d.hasSame(date, "month") &&
        d.hasSame(date, "year")
    );
  }

  // Toggle date selection for recurring mode
  function toggleDateSelection(date: DateTime) {
    if (!editMode) return;

    hasManualEdits.current = true;
    const isSelected = isDateSelected(date);

    let newDates: DateTime[];
    if (isSelected) {
      // Don't allow removing the last date
      if (selectedDates.length <= 1) return;

      // Remove date
      newDates = selectedDates.filter(
        (d) =>
          !(
            d.hasSame(date, "day") &&
            d.hasSame(date, "month") &&
            d.hasSame(date, "year")
          )
      );
    } else {
      // Add date
      newDates = [...selectedDates, date.startOf("day")];
    }

    setSelectedDates(newDates);
    onChange(formatDatesToApi(newDates));
  }

  // Reset to auto-generated schedule
  function resetSchedule() {
    hasManualEdits.current = false;
    const baseDate =
      selectedDates.length > 0 ? selectedDates[0] : DateTime.now();
    const newDates = generateSchedule(baseDate, sessionCount, repeatFrequency);
    setSelectedDates(newDates);
    onChange(formatDatesToApi(newDates));
  }

  // Update API when times change
  useEffect(() => {
    if (selectedDates.length === 0) return;
    onChange(formatDatesToApi(selectedDates));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime]);

  // Render day for multi-select calendar
  const renderDay = (dayProps: PickersDayProps<DateTime>) => {
    const isSelected = isDateSelected(dayProps.day);

    return (
      <CustomPickersDay
        {...dayProps}
        isSelected={isSelected}
        disabled={dayProps.disabled}
        sx={{
          ...(editMode && {
            cursor: "pointer",
          }),
          ...(!editMode &&
            !isSelected && {
              pointerEvents: "none",
            }),
        }}
        onClick={() =>
          editMode ? toggleDateSelection(dayProps.day) : undefined
        }
      />
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Tipo di calendario</FormLabel>
        <RadioGroup
          row
          value={scheduleType}
          onChange={(e) =>
            handleScheduleTypeChange(e.target.value as "single" | "recurring")
          }
        >
          <FormControlLabel
            value="single"
            control={<Radio />}
            label="Sessione singola"
          />
          <FormControlLabel
            value="recurring"
            control={<Radio />}
            label="Più sessioni"
          />
        </RadioGroup>
      </FormControl>

      {scheduleType === "recurring" && !editMode && (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Numero di sessioni"
                type="number"
                InputProps={{ inputProps: { min: 2 } }}
                value={sessionCount}
                onChange={(e) => {
                  const newCount = Math.max(2, parseInt(e.target.value) || 2);
                  setSessionCount(newCount);
                  if (!hasManualEdits.current && !editMode) {
                    handleScheduleParamsChange();
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Frequenza</FormLabel>
                <RadioGroup
                  row
                  value={repeatFrequency}
                  onChange={(e) => {
                    setRepeatFrequency(e.target.value as "weekly" | "monthly");
                    if (!hasManualEdits.current && !editMode) {
                      handleScheduleParamsChange();
                    }
                  }}
                >
                  <FormControlLabel
                    value="weekly"
                    control={<Radio />}
                    label="Settimanale"
                  />
                  <FormControlLabel
                    value="monthly"
                    control={<Radio />}
                    label="Mensile"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          {hasManualEdits.current && (
            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                onClick={resetSchedule}
                variant="outlined"
                color="secondary"
              >
                Ripristina calendario originale
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                Nota: hai modificato manualmente alcune date
              </Typography>
            </Box>
          )}
        </Stack>
      )}

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1">
              {editMode
                ? "Gestisci le date (clicca per aggiungere/rimuovere)"
                : scheduleType === "single"
                  ? "Seleziona la data"
                  : "Seleziona la prima data"}
            </Typography>

            {scheduleType === "recurring" && selectedDates.length > 1 && (
              <Button
                size="small"
                startIcon={editMode ? null : <Edit />}
                onClick={() => setEditMode(!editMode)}
                variant={editMode ? "contained" : "outlined"}
                color={editMode ? "primary" : "inherit"}
              >
                {editMode ? "Fine Modifica" : "Modifica Date"}
              </Button>
            )}
          </Box>

          <Box
            sx={{
              border: editMode ? "1px dashed #ccc" : "none",
              p: editMode ? 1 : 0,
              borderRadius: 1,
              bgcolor: editMode ? "rgba(0,0,0,0.02)" : "transparent",
            }}
          >
            {editMode && (
              <Typography
                variant="caption"
                sx={{ display: "block", mb: 1, color: "text.secondary" }}
              >
                Clicca su una data per aggiungerla o rimuoverla
              </Typography>
            )}

            {/* Use different calendar components based on mode */}
            {scheduleType === "single" ? (
              <DateCalendar
                value={singleDate}
                onChange={handleSingleDateChange}
                disablePast
              />
            ) : (
              <DateCalendar
                value={null}
                disablePast
                slots={{
                  day: renderDay,
                }}
              />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1">Orario di inizio</Typography>
              <MultiSectionDigitalClock
                value={startTime}
                onChange={(newValue) => {
                  if (newValue) {
                    setStartTime(newValue);
                  }
                }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1">Orario di fine</Typography>
              <MultiSectionDigitalClock
                value={endTime}
                onChange={(newValue) => {
                  if (newValue) {
                    setEndTime(newValue);
                  }
                }}
              />
            </Box>
          </Stack>
        </Grid>
      </Grid>

      {selectedDates.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1">
            Date pianificate ({selectedDates.length}):
          </Typography>
          <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedDates
              .sort((a, b) => a.toMillis() - b.toMillis())
              .map((date, index) => (
                <Chip
                  key={index}
                  label={`${date.toLocaleString(DateTime.DATE_SHORT)} ${startTime.toFormat("HH:mm")}-${endTime.toFormat("HH:mm")}`}
                  onDelete={
                    editMode && selectedDates.length > 1
                      ? () => toggleDateSelection(date)
                      : undefined
                  }
                  color={editMode ? "primary" : "default"}
                  variant={editMode ? "outlined" : "filled"}
                />
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
