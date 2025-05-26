import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import { usePatientForm } from "../../../../hooks/usePatientForm";
import AnthropometricData from "./AnthropometricData";
import VitalSigns from "./VitalSigns";
import MedicalHistory from "./MedicalHistory";
import LifeStyle from "./LifeStyle";
import OtherData from "./OtherData";
import { PatientDto, UpdateAuthUserDto } from "@easymotion/openapi";
import { useProfile } from "../../../../hooks/useProfile";
import CloseIcon from "@mui/icons-material/Close";

const steps = [
  "Benvenuto",
  "Dati Antropometrici",
  "Segni Vitali",
  "Storia Medica",
  "Stile di Vita",
  "Altri Dati",
];

interface StepSectionProps {
  title: string;
  children: React.ReactNode;
}

function StepSection({ title, children }: StepSectionProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 4 },
        bgcolor: "background.default",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: "primary.main",
          fontWeight: 600,
          mb: { xs: 2, sm: 4 },
          letterSpacing: "-0.5px",
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

export interface PatientSettingsWizardProps {
  open: boolean;
  onClose: () => void;
}

interface InternalPatientSettingsWizardProps
  extends PatientSettingsWizardProps {
  patient: PatientDto | null;
  onSave: (data: UpdateAuthUserDto) => void;
}

export default function PatientSettingsWizard(
  props: PatientSettingsWizardProps
) {
  const profile = useProfile();

  if (profile.get.isLoading || profile.get.isError) {
    return null;
  }

  if (profile.get.data?.role !== "USER") {
    return null;
  }

  return (
    <InternalPatientSettingsWizard
      open={props.open}
      onClose={props.onClose}
      patient={profile.get.data.patient ?? null}
      onSave={(updatedPatient) =>
        profile.updatePatient.mutate(updatedPatient.patient)
      }
    />
  );
}

function InternalPatientSettingsWizard(
  props: InternalPatientSettingsWizardProps
) {
  const { open, onClose, patient, onSave } = props;
  const [activeStep, setActiveStep] = useState(0);
  const patientForm = usePatientForm({ patient, onSave });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      patientForm.handleSubmit(patientForm.onSubmitEvent)();
      onClose();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return (
          <StepSection title="Inserisci i tuoi dati antropometrici e le informazioni sulla tua attività fisica">
            <AnthropometricData {...patientForm} />
          </StepSection>
        );
      case 2:
        return (
          <StepSection title="Inserisci i tuoi segni vitali per un monitoraggio accurato della tua salute">
            <VitalSigns {...patientForm} />
          </StepSection>
        );
      case 3:
        return (
          <StepSection title="Fornisci informazioni sulla tua storia medica per una valutazione completa">
            <MedicalHistory {...patientForm} />
          </StepSection>
        );
      case 4:
        return (
          <StepSection title="Descrivi il tuo stile di vita per personalizzare al meglio il tuo percorso">
            <LifeStyle {...patientForm} />
          </StepSection>
        );
      case 5:
        return (
          <StepSection title="Aggiungi eventuali note o obiettivi personali per completare il tuo profilo">
            <OtherData {...patientForm} />
          </StepSection>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)" },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pt: { xs: 3, sm: 5 },
          position: "relative",
          pb: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 4 },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: { xs: 8, sm: 16 },
            top: { xs: 8, sm: 16 },
            color: (theme) => theme.palette.grey[500],
            "&:hover": {
              color: (theme) => theme.palette.grey[700],
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            "& .MuiStepLabel-label": {
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              fontWeight: 500,
              mt: { xs: 0.5, sm: 1 },
            },
            "& .MuiStepLabel-label.Mui-active": {
              fontWeight: 600,
            },
            "& .MuiStepIcon-root": {
              color: "primary.light",
              width: { xs: 24, sm: 32 },
              height: { xs: 24, sm: 32 },
            },
            "& .MuiStepIcon-root.Mui-active": {
              color: "primary.main",
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: "success.main",
            },
            "& .MuiStepConnector-line": {
              minHeight: { xs: 2, sm: 3 },
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 4 } }}>
        <Box>{renderStepContent(activeStep)}</Box>
      </DialogContent>
      <DialogActions
        sx={{
          pb: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 4 },
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
          "& .MuiButton-root": {
            width: { xs: "100%", sm: "auto" },
            minHeight: { xs: "48px", sm: "36px" },
            m: 0,
          },
        }}
      >
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            order: { xs: 2, sm: 1 },
          }}
        >
          Indietro
        </Button>
        <Button
          onClick={handleNext}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            order: { xs: 1, sm: 2 },
          }}
        >
          {activeStep === steps.length - 1 ? "Completa" : "Avanti"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function WelcomeStep() {
  return (
    <StepSection title="Aggiorna il tuo profilo">
      <Stack sx={{ mx: "auto" }} gap={2}>
        <Typography variant="body1" color="text.primary">
          Le informazioni che fornirai ci aiuteranno a personalizzare al meglio
          il tuo percorso di riabilitazione e monitoraggio. Queste
          riguarderanno:
        </Typography>
        <Box component="ul" sx={{ textAlign: "left", pl: 4 }}>
          <Typography component="li" variant="body1" color="text.primary">
            <strong>Dati Antropometrici:</strong> altezza, peso e informazioni
            sulla tua attività fisica
          </Typography>
          <Typography component="li" variant="body1" color="text.primary">
            <strong>Segni Vitali:</strong> pressione sanguigna e frequenza
            cardiaca
          </Typography>
          <Typography component="li" variant="body1" color="text.primary">
            <strong>Storia Medica:</strong> farmaci, allergie e altre patologie
          </Typography>
          <Typography component="li" variant="body1" color="text.primary">
            <strong>Stile di Vita:</strong> abitudini e fattori psicosociali
          </Typography>
          <Typography component="li" variant="body1" color="text.primary">
            <strong>Altri Dati:</strong> note aggiuntive e obiettivi personali
          </Typography>
        </Box>
      </Stack>
    </StepSection>
  );
}
