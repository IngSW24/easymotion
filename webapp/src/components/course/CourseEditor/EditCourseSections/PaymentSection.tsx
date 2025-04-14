import React from "react";
import {
  TextField,
  FormControlLabel,
  Box,
  Grid,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Switch,
  FormHelperText,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { CourseFormData } from "../schema";
import { paymentRecurrence } from "../../../../data/payment-type";

function PriceInput({
  label,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Remove all non-digit characters except comma
    const cleanValue = input.replace(/[^\d,]/g, "");

    // Handle comma
    const parts = cleanValue.split(",");
    if (parts.length > 2) return; // Invalid input

    let formattedValue: string;
    if (parts.length === 1) {
      // No comma, treat as whole number
      formattedValue = parts[0] || "0";
    } else {
      // Has comma, combine parts
      const whole = parts[0] || "0";
      const decimal = parts[1].slice(0, 2).padEnd(2, "0");
      formattedValue = `${whole},${decimal}`;
    }

    onChange(formattedValue);
  };

  return (
    <TextField
      value={value}
      onChange={handleChange}
      label={label}
      type="text"
      error={error}
      helperText={helperText}
      required
      disabled={disabled}
      slotProps={{
        input: {
          startAdornment: "€",
        },
      }}
      inputProps={{
        inputMode: "decimal",
      }}
    />
  );
}

function MaxSubscribersInput({
  value,
  onChange,
  error,
  helperText,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
  error?: boolean;
  helperText?: string;
}) {
  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={value !== null}
            onChange={(e) => onChange(e.target.checked ? 1 : null)}
          />
        }
        label="Limita numero di partecipanti"
      />

      {value !== null && (
        <TextField
          value={value}
          onChange={(e) => {
            const newValue = e.target.value
              ? Math.max(1, Math.floor(Number(e.target.value)))
              : 1;
            onChange(newValue);
          }}
          fullWidth
          type="number"
          label="Numero massimo di partecipanti"
          sx={{ mt: 2 }}
          error={error}
          helperText={helperText}
          inputProps={{
            min: "1",
            step: "1",
          }}
        />
      )}
    </>
  );
}

export default function PaymentSection() {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CourseFormData>();

  // Form values
  const price = watch("price");
  const paymentRecurrenceValue = watch("payment_recurrence");
  const maxSubscribers = watch("max_subscribers");

  // Local state for price formatting
  const [priceFormatted, setPriceFormatted] = React.useState<string>(
    price ? price.toFixed(2).replace(".", ",") : "0,00"
  );

  // Determine if the course is free
  const isFree = price === 0;

  // Handle free course toggle
  const handleFreeToggle = (checked: boolean) => {
    if (checked) {
      setValue("price", 0, { shouldValidate: true });
      setPriceFormatted("0,00");
    } else {
      setValue("price", 0.01, { shouldValidate: true });
      setPriceFormatted("0,01");
    }
  };

  // Handle price change
  React.useEffect(() => {
    const numericPrice = Number(priceFormatted.replace(",", "."));
    setValue("price", numericPrice, { shouldValidate: true });
  }, [priceFormatted, setValue]);

  // Handle payment recurrence change
  const handleRecurrenceChange = (value: string) => {
    setValue(
      "payment_recurrence",
      value as CourseFormData["payment_recurrence"],
      {
        shouldValidate: true,
      }
    );
  };

  // Handle max subscribers change
  const handleMaxSubscribersChange = (value: number | null) => {
    setValue("max_subscribers", value, { shouldValidate: true });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isFree}
                onChange={(e) => handleFreeToggle(e.target.checked)}
              />
            }
            label="Corso gratuito"
          />

          <PriceInput
            label="Prezzo"
            value={priceFormatted}
            onChange={setPriceFormatted}
            error={!!errors.price}
            helperText={errors.price?.message}
            disabled={isFree}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl component="fieldset" disabled={isFree}>
            <FormLabel component="legend">Modalità di pagamento</FormLabel>
            <RadioGroup
              value={paymentRecurrenceValue}
              onChange={(e) => handleRecurrenceChange(e.target.value)}
            >
              {paymentRecurrence.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={
                    option.label.charAt(0).toUpperCase() + option.label.slice(1)
                  }
                />
              ))}
            </RadioGroup>
            {!isFree && Number(priceFormatted.replace(",", ".")) < 0.01 && (
              <FormHelperText error>
                Il prezzo deve essere di almeno 0,01€
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>

      <MaxSubscribersInput
        value={maxSubscribers ?? null}
        onChange={handleMaxSubscribersChange}
        error={!!errors.max_subscribers}
        helperText={errors.max_subscribers?.message}
      />
    </Box>
  );
}
