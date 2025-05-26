import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { PatientDto, UpdateAuthUserDto } from "@easymotion/openapi";
import { usePatientForm } from "../../../../hooks/usePatientForm";
import AnthropometricData from "./AnthropometricData";
import VitalSigns from "./VitalSigns";
import MedicalHistory from "./MedicalHistory";
import LifeStyle from "./LifeStyle";
import OtherData from "./OtherData";

export interface PatientSettingsProps {
  patient: PatientDto | null;
  onSave: (data: UpdateAuthUserDto) => void;
}

export default function PatientSettings(props: PatientSettingsProps) {
  const { patient, onSave } = props;
  const usePatientProps = usePatientForm({ patient, onSave });

  return (
    <Card
      sx={{ width: "100%", m: "auto", boxShadow: 3, borderRadius: 3, p: 3 }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Person sx={{ mr: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            Dati sanitari
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <AnthropometricData
          {...usePatientProps}
          title="Dati anagrafici e antropometrici"
        />

        <Divider sx={{ my: 2 }} />

        <VitalSigns {...usePatientProps} title="Segni vitali" />

        <Divider sx={{ my: 2 }} />

        <MedicalHistory {...usePatientProps} title="Storia medica" />

        <Divider sx={{ my: 2 }} />

        <LifeStyle
          {...usePatientProps}
          title="Stile di vita e fattori psicosociali"
        />

        <Divider sx={{ my: 2 }} />

        <OtherData {...usePatientProps} title="Altri dati" />

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!usePatientProps.formState.isDirty}
            onClick={usePatientProps.handleSubmit(
              usePatientProps.onSubmitEvent
            )}
            sx={{ paddingX: 3, marginTop: { xs: 2, sm: 0 } }}
          >
            Salva
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
