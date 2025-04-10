import React from "react";
import {
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Grid2,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormHelperText,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { CourseFormData } from "../schema";

type PaymentType = "free" | "single" | "multiple";

function PaymentTypeSelector({
  value,
  onChange,
}: {
  value: PaymentType;
  onChange: (type: PaymentType) => void;
}) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Opzioni di pagamento</FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value as PaymentType)}
      >
        <FormControlLabel value="free" control={<Radio />} label="Gratuito" />
        <FormControlLabel
          value="single"
          control={<Radio />}
          label="Pagamento singolo"
        />
        <FormControlLabel
          value="multiple"
          control={<Radio />}
          label="Pagamenti multipli"
        />
      </RadioGroup>
    </FormControl>
  );
}

function PriceInput({
  label,
  value,
  onChange,
  error,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
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
    formState: { errors: formErrors },
    setValue,
    watch,
  } = useFormContext<CourseFormData>();

  // Form values
  const formPrice = watch("price");
  const formNumPayments = watch("number_of_payments");
  const formIsFree = watch("is_free");
  const formMaxSubscribers = watch("max_subscribers");

  // Local state
  const [paymentType, setPaymentType] = React.useState<PaymentType>(
    formIsFree
      ? "free"
      : formNumPayments && formNumPayments > 1
        ? "multiple"
        : "single"
  );
  const [price, setPrice] = React.useState<string>(
    formPrice ? formPrice.toFixed(2).replace(".", ",") : "0,00"
  );
  const [numPayments, setNumPayments] = React.useState<number>(
    formNumPayments || 2
  );

  // Update form values when local state changes
  React.useEffect(() => {
    setValue("is_free", paymentType === "free");
    if (paymentType === "single") {
      setValue("number_of_payments", 1);
    }
  }, [paymentType, setValue]);

  React.useEffect(() => {
    const numericPrice = Number(price.replace(",", "."));
    setValue("price", numericPrice, { shouldValidate: true });
  }, [price, setValue]);

  React.useEffect(() => {
    setValue("number_of_payments", numPayments);
  }, [numPayments, setValue]);

  const handlePaymentTypeChange = (type: PaymentType) => {
    setPaymentType(type);
  };

  const handleMaxSubscribersChange = (value: number | null) => {
    setValue("max_subscribers", value);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <PaymentTypeSelector
            value={paymentType}
            onChange={handlePaymentTypeChange}
          />
        </Grid2>

        {paymentType !== "free" && (
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <PriceInput
                label={
                  paymentType === "multiple" ? "Prezzo per rata" : "Prezzo"
                }
                value={price}
                onChange={setPrice}
                error={!!formErrors.price}
                helperText={formErrors.price?.message}
              />

              {paymentType === "multiple" && (
                <>
                  <TextField
                    value={numPayments}
                    onChange={(e) => {
                      const value = e.target.value
                        ? Math.max(2, Math.floor(Number(e.target.value)))
                        : 2;
                      setNumPayments(value);
                    }}
                    label="Numero di rate"
                    type="number"
                    error={!!formErrors.number_of_payments}
                    helperText={formErrors.number_of_payments?.message}
                    inputProps={{
                      min: "2",
                      step: "1",
                    }}
                  />
                  <FormHelperText>
                    Prezzo totale:{" "}
                    {(Number(price.replace(",", ".")) * numPayments)
                      .toFixed(2)
                      .replace(".", ",")}
                    €
                  </FormHelperText>
                </>
              )}
            </Box>
          </Grid2>
        )}
      </Grid2>

      <MaxSubscribersInput
        value={formMaxSubscribers ?? null}
        onChange={handleMaxSubscribersChange}
        error={!!formErrors.max_subscribers}
        helperText={formErrors.max_subscribers?.message}
      />
    </Box>
  );
}
