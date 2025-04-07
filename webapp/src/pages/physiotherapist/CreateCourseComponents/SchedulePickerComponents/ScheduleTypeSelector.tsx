import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Paper,
} from "@mui/material";
import { Event, EventRepeat } from "@mui/icons-material";

export interface ScheduleTypeSelectorProps {
  value: "single" | "recurring";
  onChange: (value: "single" | "recurring") => void;
}

export default function ScheduleTypeSelector(props: ScheduleTypeSelectorProps) {
  const { value, onChange } = props;

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <FormControl component="fieldset" fullWidth>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <FormLabel
            component="legend"
            sx={{ fontWeight: 500, fontSize: "1rem" }}
          >
            Tipo di calendario
          </FormLabel>
        </Box>

        <RadioGroup
          row
          value={value}
          onChange={(e) => onChange(e.target.value as "single" | "recurring")}
        >
          <FormControlLabel
            value="single"
            control={<Radio color="primary" />}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Event sx={{ mr: 0.5, fontSize: "1.1rem" }} />
                <span>Sessione singola</span>
              </Box>
            }
            sx={{ mr: 4 }}
          />
          <FormControlLabel
            value="recurring"
            control={<Radio color="primary" />}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EventRepeat sx={{ mr: 0.5, fontSize: "1.1rem" }} />
                <span>Più sessioni</span>
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>
    </Paper>
  );
}
