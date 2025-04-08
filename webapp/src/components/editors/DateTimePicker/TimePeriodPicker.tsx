import { Stack } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";

interface TimePeriodPickerProps {
  start: DateTime;
  end: DateTime;
  onChange: (newStart: DateTime, newEnd: DateTime) => void;
}

export default function TimePeriodPicker(props: TimePeriodPickerProps) {
  const handleStartChange = (start: DateTime | null) => {
    if (start) props.onChange(start, props.end);
  };

  const handleEndChange = (end: DateTime | null) => {
    if (end) props.onChange(props.start, end);
  };

  return (
    <Stack direction="row" gap={3}>
      <DateTimePicker
        label="Data inizio iscrizioni"
        value={props.start}
        onChange={handleStartChange}
      />
      <DateTimePicker
        label="Data fine iscrizioni"
        value={props.end}
        onChange={handleEndChange}
      />
    </Stack>
  );
}
