import { useState, useEffect } from "react";
import { Box, Typography, Grid, Alert } from "@mui/material";
import { DateTime } from "luxon";
import CalendarPicker from "./SchedulePickerComponents/CalendarPicker";
import RecurringOptions from "./SchedulePickerComponents/RecurringOptions";
import ScheduleTypeSelector from "./SchedulePickerComponents/ScheduleTypeSelector";
import { CourseSession } from "./SchedulePickerComponents/types";
import SessionList from "./SchedulePickerComponents/SessionList";

export interface SchedulePickerProps {
  initialSchedule: CourseSession[];
  onScheduleChange: (sessions: CourseSession[]) => void;
}

export default function SchedulePicker({
  onScheduleChange,
  initialSchedule,
}: SchedulePickerProps) {
  // Schedule type state
  const [scheduleType, setScheduleType] = useState<"single" | "recurring">(
    initialSchedule && initialSchedule.length > 1 ? "recurring" : "single"
  );
  const [sessionCount, setSessionCount] = useState(
    initialSchedule.length > 0 ? initialSchedule.length : 1
  );
  const [schedule, setSchedule] = useState(
    initialSchedule.length === 0
      ? [
          {
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
          },
        ]
      : initialSchedule
  );
  const [repeatFrequency, setRepeatFrequency] = useState<"weekly" | "biweekly">(
    "weekly"
  );
  const [editMode, setEditMode] = useState(false);
  const [manualEdited, setManualEdited] = useState(
    initialSchedule ? initialSchedule.length > 0 : false
  );
  const [error, setError] = useState<string | null>(null);

  // Date states
  const [singleDate, setSingleDate] = useState<DateTime>(
    initialSchedule.length > 0
      ? initialSchedule[0].startTime
      : DateTime.now().set({ hour: 9, minute: 0, second: 0, millisecond: 0 })
  );

  const [baseDate, setBaseDate] = useState<DateTime | null>(
    initialSchedule.length > 0
      ? initialSchedule[0].startTime
      : DateTime.now().set({ hour: 9, minute: 0, second: 0, millisecond: 0 })
  );

  // Duration options for sessions (in minutes)

  // Create time-adjusted session from a date
  const createSessionFromDate = (date: DateTime): CourseSession => {
    const startTime = date.set({
      hour: 9,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    return {
      startTime,
      endTime: startTime.plus({ hours: 2 }),
    };
  };

  // Effect to update parent component when schedule changes
  useEffect(() => {
    onScheduleChange(schedule);
  }, [schedule, onScheduleChange]);

  // Handle schedule type change
  const handleScheduleTypeChange = (newType: "single" | "recurring") => {
    setScheduleType(newType);
    setEditMode(false);
    setError(null);
    setManualEdited(false);

    // Update sessions based on type
    if (newType === "single") {
      const newSchedule = singleDate ? [createSessionFromDate(singleDate)] : [];
      setSchedule(newSchedule);
    } else {
      // If switching to recurring and we have a base date, generate sessions
      if (baseDate) {
        generateSessions(baseDate, sessionCount, repeatFrequency);
      }
    }
  };

  // Handle single date change
  const handleSingleDateChange = (date: DateTime | null) => {
    if (!date) return;

    setSingleDate(date);
    const newSession = createSessionFromDate(date);
    setSchedule([newSession]);
  };

  // Handle base date change for recurring sessions
  const handleRecurringBaseDateChange = (date: DateTime | null) => {
    if (!date) return;

    setBaseDate(date);
    generateSessions(date, sessionCount, repeatFrequency);
  };

  // Generate recurring sessions
  const generateSessions = (
    startDate: DateTime,
    count: number,
    frequency: "weekly" | "biweekly"
  ) => {
    const newSessions: CourseSession[] = [];
    let currentDate = startDate;

    for (let i = 0; i < count; i++) {
      newSessions.push(createSessionFromDate(currentDate));
      currentDate =
        frequency === "weekly"
          ? currentDate.plus({ weeks: 1 })
          : currentDate.plus({ weeks: 2 });
    }

    setSchedule(newSessions);
  };

  // Handle session count change
  const handleSessionCountChange = (count: number) => {
    if (count < 1) return;

    setSessionCount(count);

    if (baseDate && !manualEdited) {
      generateSessions(baseDate, count, repeatFrequency);
    }
  };

  // Handle repeat frequency change
  const handleRepeatFrequencyChange = (frequency: "weekly" | "biweekly") => {
    setRepeatFrequency(frequency);

    if (baseDate && !manualEdited) {
      generateSessions(baseDate, sessionCount, frequency);
    }
  };

  // Handle reset recurring options
  const handleResetOptions = () => {
    setManualEdited(false);
    if (baseDate) {
      generateSessions(baseDate, sessionCount, repeatFrequency);
    }
  };

  // Check if a date is selected in recurring mode
  const isDateSelected = (date: DateTime) => {
    return schedule.some((session) => session.startTime.hasSame(date, "day"));
  };

  // Toggle date selection in recurring edit mode
  const toggleDateSelection = (date: DateTime) => {
    // Don't allow selecting dates in the past
    if (date < DateTime.now().startOf("day")) {
      return;
    }

    setManualEdited(true);

    const isSelected = isDateSelected(date);
    let updatedSchedule;

    if (isSelected) {
      // Remove the date if it's already selected
      updatedSchedule = schedule.filter(
        (session) => !session.startTime.hasSame(date, "day")
      );
    } else {
      // Add the date if it's not already selected
      updatedSchedule = [...schedule, createSessionFromDate(date)];
    }

    // Sort sessions by date
    updatedSchedule.sort(
      (a, b) => a.startTime.toMillis() - b.startTime.toMillis()
    );

    setSchedule(updatedSchedule);

    // If we've removed all sessions, trigger an error
    if (updatedSchedule.length === 0) {
      setError("Devi selezionare almeno una data");
    } else {
      setError(null);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Programmazione
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ScheduleTypeSelector
            value={scheduleType}
            onChange={handleScheduleTypeChange}
          />
        </Grid>

        <Grid item xs={12} md={scheduleType === "recurring" ? 8 : 12}>
          <CalendarPicker
            scheduleType={scheduleType}
            editMode={editMode}
            setEditMode={setEditMode}
            singleDate={singleDate}
            handleSingleDateChange={handleSingleDateChange}
            baseDate={baseDate}
            sessions={schedule.map((session) => ({ date: session.startTime }))}
            isDateSelected={isDateSelected}
            toggleDateSelection={toggleDateSelection}
            handleRecurringBaseDateChange={handleRecurringBaseDateChange}
          />
        </Grid>

        {scheduleType === "recurring" && (
          <Grid item xs={12} md={4}>
            <RecurringOptions
              sessionCount={sessionCount}
              repeatFrequency={repeatFrequency}
              manualEdited={manualEdited}
              onSessionCountChange={handleSessionCountChange}
              onFrequencyChange={handleRepeatFrequencyChange}
              onResetOptions={handleResetOptions}
              sessionsCount={schedule.length}
            />
          </Grid>
        )}

        {/* Sessions List */}
        <Grid item xs={12}>
          <SessionList
            schedule={schedule}
            onScheduleUpdate={(s) => setSchedule(s)}
          />
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
