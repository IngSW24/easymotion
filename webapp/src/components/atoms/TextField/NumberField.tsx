import { TextField, TextFieldProps } from "@mui/material";

export default function NumberField(props: TextFieldProps) {
  return <TextField {...props} type="number" fullWidth size="small" />;
}
