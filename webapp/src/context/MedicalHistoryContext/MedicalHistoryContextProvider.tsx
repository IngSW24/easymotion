import { useEffect, useState } from "react";
import { useAuth } from "@easymotion/auth-context";
import { MedicalHistoryContext } from "./MedicalHistoryContext";
import PatientSettingsWizard from "../../components/auth/ProfileSettings/Patient/PatientSettingsWizard";

const getWizardPromptKey = (userId: string) =>
  `patient_wizard_prompted_${userId}`;

export interface MedicalHistoryContextProps {
  children: React.ReactNode;
}

export default function MedicalHistoryContextProvider(
  props: MedicalHistoryContextProps
) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "USER") return;

    // supposing the user is signing up, skips opening the dialog
    // if it's on the email confirm page, will do next time
    if (window.location.pathname.startsWith("/confirm-email")) return;

    const wizardKey = getWizardPromptKey(user.id);
    const hasBeenPrompted = localStorage.getItem(wizardKey);
    if (!hasBeenPrompted) {
      setOpen(true);
      localStorage.setItem(wizardKey, "true");
    }
  }, [user]);

  const handleClose = () => setOpen(false);

  return (
    <MedicalHistoryContext.Provider value={{ openDialog: () => setOpen(true) }}>
      {props.children}
      <PatientSettingsWizard open={open} onClose={handleClose} />
    </MedicalHistoryContext.Provider>
  );
}
