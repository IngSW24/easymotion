import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

export type PaymentType = "free" | "single" | "multiple";

interface PaymentOptionsProps {
  cost: number | undefined;
  onCostChange: (cost: number | undefined) => void;
  paymentType: PaymentType;
  onPaymentTypeChange: (type: PaymentType) => void;
  numPayments: number;
  onNumPaymentsChange: (num: number) => void;
}

export default function PaymentOptions({
  cost,
  onCostChange,
  paymentType,
  onPaymentTypeChange,
  numPayments,
  onNumPaymentsChange,
}: PaymentOptionsProps) {
  const handleCostChange = (value: string) => {
    const parsedValue = parseFloat(value);
    onCostChange(isNaN(parsedValue) ? undefined : parsedValue);
  };

  const handleNumPaymentsChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    onNumPaymentsChange(
      isNaN(parsedValue) || parsedValue < 2 ? 2 : parsedValue
    );
  };

  return (
    <Box>
      <FormControl component="fieldset">
        <FormLabel component="legend">Opzioni di pagamento</FormLabel>
        <RadioGroup
          value={paymentType}
          onChange={(e) => onPaymentTypeChange(e.target.value as PaymentType)}
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

      {paymentType === "single" && (
        <TextField
          fullWidth
          label="Prezzo"
          type="number"
          InputProps={{ inputProps: { min: 0, step: 0.01 } }}
          value={cost === undefined ? "" : cost}
          onChange={(e) => handleCostChange(e.target.value)}
          sx={{ mt: 2 }}
        />
      )}

      {paymentType === "multiple" && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Prezzo per rata"
              type="number"
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              value={cost === undefined ? "" : cost}
              onChange={(e) => handleCostChange(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Numero di rate"
              type="number"
              InputProps={{ inputProps: { min: 2 } }}
              value={numPayments}
              onChange={(e) => handleNumPaymentsChange(e.target.value)}
            />
            <FormHelperText>
              Prezzo totale: {((cost || 0) * numPayments).toFixed(2)}€
            </FormHelperText>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
