import React from "react";
import { Duration } from "luxon";
import { TextField, Stack } from "@mui/material";

interface DurationPickerProps {
  value: Duration;
  onDurationChange: (duration: Duration) => void;
}

export default function DurationPicker(props: DurationPickerProps) {
  const { onDurationChange, value } = props;

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = Math.max(0, parseInt(e.target.value, 10) || 0);
    onDurationChange(value.set({ hours: newHours }));
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = Math.max(
      0,
      Math.min(59, parseInt(e.target.value, 10) || 0)
    );
    onDurationChange(value.set({ minutes: newMinutes }));
  };

  return (
    <Stack direction="row" gap={3}>
      <TextField
        label="Ore"
        type="number"
        value={value.get("hours")}
        onChange={handleHoursChange}
      />
      <TextField
        label="Minuti"
        type="number"
        value={value.get("minutes")}
        onChange={handleMinutesChange}
      />
    </Stack>
  );
}
