import { useState, useEffect } from "react";
import { Box, Typography, Grid, Alert } from "@mui/material";
import { DateTime } from "luxon";
import CalendarPicker from "./CalendarPicker";
import RecurringOptions from "./RecurringOptions";
import SessionTypeSelector from "./SessionTypeSelector";
import { CourseSession } from "./types";
import SessionList from "./SessionList";

export interface SessionBuilderProps {
  initialSession: CourseSession[];
  onScheduleChange: (sessions: CourseSession[]) => void;
}

export default function SessionBuilder({
  onScheduleChange: onSessionChange,
  initialSession,
}: SessionBuilderProps) {
  const [sessionType, setSessionType] = useState<"single" | "recurring">(
    initialSession && initialSession.length > 1 ? "recurring" : "single"
  );
  const [sessionCount, setSessionCount] = useState(
    initialSession.length > 0 ? initialSession.length : 1
  );
  const [session, setSession] = useState(
    initialSession.length === 0
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
      : initialSession
  );
  const [repeatFrequency, setRepeatFrequency] = useState<"weekly" | "biweekly">(
    "weekly"
  );
  const [editMode, setEditMode] = useState(false);
  const [manualEdited, setManualEdited] = useState(
    initialSession ? initialSession.length > 0 : false
  );
  const [error, setError] = useState<string | null>(null);

  // Date states
  const [singleDate, setSingleDate] = useState<DateTime>(
    initialSession.length > 0
      ? initialSession[0].startTime
      : DateTime.now().set({ hour: 9, minute: 0, second: 0, millisecond: 0 })
  );

  const [baseDate, setBaseDate] = useState<DateTime | null>(
    initialSession.length > 0
      ? initialSession[0].startTime
      : DateTime.now().set({ hour: 9, minute: 0, second: 0, millisecond: 0 })
  );

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
    onSessionChange(session);
  }, [session, onSessionChange]);

  // Handle schedule type change
  const handleSessionTypeChange = (newType: "single" | "recurring") => {
    setSessionType(newType);
    setEditMode(false);
    setError(null);
    setManualEdited(false);

    // Update sessions based on type
    if (newType === "single") {
      const newSession = singleDate ? [createSessionFromDate(singleDate)] : [];
      setSession(newSession);
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
    setSession([newSession]);
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

    setSession(newSessions);
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
    return session.some((session) => session.startTime.hasSame(date, "day"));
  };

  // Toggle date selection in recurring edit mode
  const toggleDateSelection = (date: DateTime) => {
    // Don't allow selecting dates in the past
    if (date < DateTime.now().startOf("day")) {
      return;
    }

    setManualEdited(true);

    const isSelected = isDateSelected(date);
    let updatedSession;

    if (isSelected) {
      // Remove the date if it's already selected
      updatedSession = session.filter(
        (session) => !session.startTime.hasSame(date, "day")
      );
    } else {
      // Add the date if it's not already selected
      updatedSession = [...session, createSessionFromDate(date)];
    }

    // Sort sessions by date
    updatedSession.sort(
      (a, b) => a.startTime.toMillis() - b.startTime.toMillis()
    );

    setSession(updatedSession);

    // If we've removed all sessions, trigger an error
    if (updatedSession.length === 0) {
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
          <SessionTypeSelector
            value={sessionType}
            onChange={handleSessionTypeChange}
          />
        </Grid>

        <Grid item xs={12} md={sessionType === "recurring" ? 8 : 12}>
          <CalendarPicker
            sessionType={sessionType}
            editMode={editMode}
            setEditMode={setEditMode}
            singleDate={singleDate}
            handleSingleDateChange={handleSingleDateChange}
            baseDate={baseDate}
            sessions={session.map((session) => ({ date: session.startTime }))}
            isDateSelected={isDateSelected}
            toggleDateSelection={toggleDateSelection}
            handleRecurringBaseDateChange={handleRecurringBaseDateChange}
          />
        </Grid>

        {sessionType === "recurring" && (
          <Grid item xs={12} md={4}>
            <RecurringOptions
              sessionCount={sessionCount}
              repeatFrequency={repeatFrequency}
              manualEdited={manualEdited}
              onSessionCountChange={handleSessionCountChange}
              onFrequencyChange={handleRepeatFrequencyChange}
              onResetOptions={handleResetOptions}
              sessionsCount={session.length}
            />
          </Grid>
        )}

        {/* Sessions List */}
        <Grid item xs={12}>
          <SessionList
            session={session}
            onSessionUpdate={(s) => setSession(s)}
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
