import { Box, Button, Paper, Typography } from "@mui/material";
import { DateCalendar, PickersDayProps } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { Edit, Event } from "@mui/icons-material";
import CustomPickersDay from "./CustomPickersDay";

export interface CalendarPickerProps {
  sessionType: "single" | "recurring";
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  singleDate: DateTime;
  handleSingleDateChange: (date: DateTime | null) => void;
  baseDate: DateTime | null;
  sessions: { date: DateTime }[];
  isDateSelected: (date: DateTime) => boolean;
  toggleDateSelection: (date: DateTime) => void;
  handleRecurringBaseDateChange: (date: DateTime | null) => void;
}

export default function CalendarPicker(props: CalendarPickerProps) {
  const {
    sessionType,
    editMode,
    setEditMode,
    singleDate,
    handleSingleDateChange,
    baseDate,
    sessions,
    isDateSelected,
    toggleDateSelection,
    handleRecurringBaseDateChange,
  } = props;

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
        }}
        onClick={() => {
          if (editMode) {
            toggleDateSelection(dayProps.day);
          } else if (!isSelected && sessionType === "recurring") {
            // In recurring mode without edit mode, allow selecting the base date
            handleRecurringBaseDateChange(dayProps.day);
          }
        }}
      />
    );
  };

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1.5,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          bgcolor: "rgba(0,0,0,0.02)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Event sx={{ mr: 1, color: "primary.main" }} />
          {editMode
            ? "Gestisci le date (clicca per aggiungere/rimuovere)"
            : sessionType === "single"
              ? "Seleziona la data"
              : "Seleziona la prima data"}
        </Typography>

        {sessionType === "recurring" && sessions.length > 1 && (
          <Button
            size="small"
            startIcon={<Edit />}
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
          border: editMode ? "1px dashed rgba(25, 118, 210, 0.3)" : "none",
          m: editMode ? 2 : 0,
          borderRadius: 1,
          bgcolor: editMode ? "rgba(25, 118, 210, 0.02)" : "transparent",
        }}
      >
        {editMode && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              p: 1,
              color: "text.secondary",
              bgcolor: "rgba(25, 118, 210, 0.05)",
            }}
          >
            Clicca su una data per aggiungerla o rimuoverla
          </Typography>
        )}

        {/* Use different calendar components based on mode */}
        {sessionType === "single" ? (
          <DateCalendar
            value={singleDate}
            onChange={handleSingleDateChange}
            disablePast
            sx={{ width: "100%" }}
          />
        ) : (
          <DateCalendar
            value={baseDate}
            disablePast
            slots={{
              day: renderDay,
            }}
            sx={{ width: "100%" }}
          />
        )}
      </Box>
    </Paper>
  );
}
