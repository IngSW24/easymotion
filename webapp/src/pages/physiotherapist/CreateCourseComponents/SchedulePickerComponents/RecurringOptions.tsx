import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { EventRepeat, Timer, Refresh, Warning } from "@mui/icons-material";

interface RecurringOptionsProps {
  sessionCount: number;
  repeatFrequency: "weekly" | "biweekly";
  manualEdited: boolean;
  onSessionCountChange: (count: number) => void;
  onFrequencyChange: (frequency: "weekly" | "biweekly") => void;
  onResetOptions: () => void;
  sessionsCount: number;
}

export default function RecurringOptions({
  sessionCount,
  repeatFrequency,
  manualEdited,
  onSessionCountChange,
  onFrequencyChange,
  onResetOptions,
  sessionsCount,
}: RecurringOptionsProps) {
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      onSessionCountChange(value);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <EventRepeat color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle1" fontWeight="medium">
          Impostazioni di ripetizione
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12}>
          <TextField
            label="Numero di sessioni"
            type="number"
            InputProps={{
              inputProps: { min: 1 },
              startAdornment: (
                <InputAdornment position="start">
                  <Timer fontSize="small" />
                </InputAdornment>
              ),
            }}
            value={sessionCount}
            disabled={manualEdited}
            onChange={handleCountChange}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
              Frequenza
            </FormLabel>
            <RadioGroup
              row
              value={repeatFrequency}
              onChange={(e) =>
                onFrequencyChange(e.target.value as "weekly" | "biweekly")
              }
            >
              <FormControlLabel
                value="weekly"
                control={<Radio size="small" />}
                label="Settimanale"
                disabled={manualEdited}
                sx={{ mr: 2 }}
              />
              <FormControlLabel
                value="biweekly"
                control={<Radio size="small" />}
                label="Bisettimanale"
                disabled={manualEdited}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      {manualEdited && (
        <Box sx={{ mt: 2 }}>
          <Button
            size="small"
            onClick={onResetOptions}
            variant="outlined"
            color="secondary"
            startIcon={<Refresh />}
          >
            Ripristina calendario originale
          </Button>
        </Box>
      )}

      {manualEdited && sessionsCount !== sessionCount && (
        <Box sx={{ mt: 2, p: 1, borderRadius: 1 }}>
          <Typography
            variant="body2"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Warning color="warning" sx={{ mr: 1 }} />
            Il numero di sessioni visualizzate ({sessionsCount}) non corrisponde
            al numero richiesto ({sessionCount}).
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
