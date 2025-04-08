import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid2,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

export type PaymentType = "free" | "single" | "multiple";

export interface PaymentOptionsProps {
  cost: number | null | undefined;
  onCostChange: (cost: number | null | undefined) => void;
  paymentType: PaymentType;
  onPaymentTypeChange: (type: PaymentType) => void;
  numPayments: number | null | undefined;
  onNumPaymentsChange: (num: number | null | undefined) => void;
}

export default function PaymentOptions(props: PaymentOptionsProps) {
  const {
    cost,
    onCostChange,
    paymentType,
    onPaymentTypeChange,
    numPayments,
    onNumPaymentsChange,
  } = props;

  const handleCostChange = (value: string) => {
    const parsedValue = parseFloat(value);
    onCostChange(isNaN(parsedValue) ? null : parsedValue);
  };

  const handleNumPaymentsChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    onNumPaymentsChange(isNaN(parsedValue) ? null : parsedValue);
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
          value={cost === null || cost === undefined ? "" : cost}
          onChange={(e) => handleCostChange(e.target.value)}
          sx={{ mt: 2 }}
        />
      )}

      {paymentType === "multiple" && (
        <Grid2 container spacing={2} sx={{ mt: 1 }}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Prezzo per rata"
              type="number"
              value={cost === null || cost === undefined ? "" : cost}
              onChange={(e) => handleCostChange(e.target.value)}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Numero di rate"
              type="number"
              value={
                numPayments === null || numPayments === undefined
                  ? ""
                  : numPayments
              }
              onChange={(e) => handleNumPaymentsChange(e.target.value)}
            />
            <FormHelperText>
              Prezzo totale: {((cost || 0) * (numPayments || 0)).toFixed(2)}€
            </FormHelperText>
          </Grid2>
        </Grid2>
      )}
    </Box>
  );
}
