import { Duration } from "luxon";
import { Stack } from "@mui/material";
import FormTextField from "../../atoms/TextField/FormTextField";

interface DurationPickerProps {
  value: Duration;
  onDurationChange: (duration: Duration) => void;
}

export default function DurationPicker(props: DurationPickerProps) {
  const { onDurationChange, value } = props;

  const handleHoursChange = (v: string) => {
    const newHours = Math.max(0, parseInt(v, 10) || 0);
    onDurationChange(value.set({ hours: newHours }));
  };

  const handleMinutesChange = (v: string) => {
    const newMinutes = Math.max(0, Math.min(59, parseInt(v, 10) || 0));
    onDurationChange(value.set({ minutes: newMinutes }));
  };

  return (
    <Stack direction="row" gap={3}>
      <FormTextField
        label="Ore"
        type="number"
        value={value.get("hours").toString()}
        onChange={handleHoursChange}
      />
      <FormTextField
        label="Minuti"
        type="number"
        value={value.get("minutes").toString()}
        onChange={handleMinutesChange}
      />
    </Stack>
  );
}
