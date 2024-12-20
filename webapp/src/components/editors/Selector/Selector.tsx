import { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface SelectorProps<T extends string> {
  label: string;
  options: LiteralUnionDescriptor<T>;
  onChange: (value: T) => void;
  initialValue?: T;
}

// Generic Selector Component
export default function Selector<T extends string>({
  label,
  options,
  onChange,
  initialValue,
}: SelectorProps<T>) {
  const [selectedValue, setSelectedValue] = useState<T | "">(
    initialValue || ""
  );

  const handleChange = (event: SelectChangeEvent<T | "">) => {
    const value = event.target.value as T;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={selectedValue} onChange={handleChange} label={label}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
