import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { styled } from "@mui/material/styles";
import { DateTime } from "luxon";

interface CustomPickersDayProps extends PickersDayProps<DateTime> {
  isSelected: boolean;
}

const StyledPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<CustomPickersDayProps>(({ theme, isSelected }) => ({
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "&:focus": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
}));

export default function CustomPickersDay(props: CustomPickersDayProps) {
  const { day, isSelected, ...other } = props;

  return (
    <StyledPickersDay
      {...other}
      day={day}
      isSelected={isSelected}
      selected={isSelected}
    />
  );
}
