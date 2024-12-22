import { Box, Checkbox, ListItemText, MenuItem, Select } from "@mui/material";

export interface CheckboxSelectorProps {
  values: string[];
  allValues: { label: string; value: string }[];
  onChange: (value: string[]) => void;
  maxWidth?: number;
  label?: string;
}

export default function CheckboxSelector(props: CheckboxSelectorProps) {
  const { maxWidth, values, onChange, allValues, label = "" } = props;

  return (
    <Select
      multiple
      label={label}
      value={values}
      onChange={(e) => onChange(e.target.value as string[])}
      sx={{ maxWidth }}
      renderValue={(selected) => (
        <Box sx={{ overflowX: "hidden", maxWidth }}>
          {allValues
            .filter((option) =>
              selected.some((entry) => entry === option.value)
            )
            .map((option) => option.label)
            .join(", ")}
        </Box>
      )}
    >
      {allValues.map((entry) => (
        <MenuItem key={entry.value} value={entry.value}>
          <Checkbox checked={values.indexOf(entry.value) > -1} />
          <ListItemText primary={entry.label} />
        </MenuItem>
      ))}
    </Select>
  );
}
