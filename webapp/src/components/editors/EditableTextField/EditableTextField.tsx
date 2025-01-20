import {
  TextField,
  TextFieldProps,
  Typography,
  TypographyProps,
} from "@mui/material";

export interface EditableTextFieldProps {
  TextFieldProps?: TextFieldProps;
  TypographyProps?: TypographyProps;
  isEditing: boolean;
  showValue: string;
  editValue?: string;
  onChange?: (value: string) => void;
}

export default function EditableTextField(props: EditableTextFieldProps) {
  const {
    isEditing,
    TextFieldProps,
    TypographyProps,
    showValue,
    editValue,
    onChange,
  } = props;

  return isEditing ? (
    <TextField
      fullWidth
      value={editValue}
      {...TextFieldProps}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  ) : (
    <Typography {...TypographyProps}>{showValue}</Typography>
  );
}
