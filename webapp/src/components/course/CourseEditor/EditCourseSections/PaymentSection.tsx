import React from "react";
import {
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Grid2,
} from "@mui/material";
import { PriorityHigh } from "@mui/icons-material";
import PaymentOptions, { PaymentType } from "../PaymentOptions";

interface PaymentSectionProps {
  price: number | null | undefined;
  isFree: boolean;
  numPayments: number | null | undefined;
  maxSubscribers: number | null | undefined;
  errors: {
    maxSubscribers?: string;
  };
  onCostChange: (value: number | null | undefined) => void;
  onPaymentTypeChange: (paymentType: PaymentType) => void;
  onNumPaymentsChange: (value: number | null | undefined) => void;
  onMaxSubscribersToggle: (checked: boolean) => void;
  onMaxSubscribersChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  price,
  isFree,
  numPayments,
  maxSubscribers,
  errors,
  onCostChange,
  onPaymentTypeChange,
  onNumPaymentsChange,
  onMaxSubscribersToggle,
  onMaxSubscribersChange,
}) => {
  return (
    <Grid2 container spacing={3}>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", mb: 2 }}
        >
          <PriorityHigh sx={{ mr: 1 }} /> Opzioni di pagamento
        </Typography>
        <PaymentOptions
          cost={price}
          onCostChange={onCostChange}
          paymentType={
            isFree
              ? "free"
              : numPayments !== null && numPayments !== undefined
                ? "multiple"
                : "single"
          }
          onPaymentTypeChange={onPaymentTypeChange}
          numPayments={numPayments}
          onNumPaymentsChange={onNumPaymentsChange}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <FormControlLabel
          control={
            <Switch
              checked={maxSubscribers !== null}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onMaxSubscribersToggle(e.target.checked)
              }
            />
          }
          label="Limita numero di partecipanti"
        />
        {maxSubscribers !== null && (
          <TextField
            fullWidth
            type="number"
            label="Numero massimo di partecipanti"
            value={maxSubscribers}
            onChange={onMaxSubscribersChange}
            sx={{ mt: 2 }}
            error={!!errors.maxSubscribers}
            helperText={errors.maxSubscribers}
          />
        )}
      </Grid2>
    </Grid2>
  );
};

export default React.memo(PaymentSection);
