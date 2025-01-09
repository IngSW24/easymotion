import { TextField } from "@mui/material";

interface FormTextFieldProps {
  id?: string;
  label?: string;
  type?: string;
  multiline?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export default function FormTextField({
  id,
  label,
  type,
  multiline,
  value,
  onChange,
}: FormTextFieldProps) {
  return (
    <TextField
      id={id}
      label={label}
      value={value}
      type={type}
      multiline={multiline}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      fullWidth
    />
  );
}
