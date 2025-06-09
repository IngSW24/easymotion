import { useContext } from "react";
import { MedicalHistoryContext } from "../context/MedicalHistoryContext/MedicalHistoryContext";

export const useMedicalHistoryContext = () => {
  const context = useContext(MedicalHistoryContext);
  if (!context) {
    throw new Error(
      "useMedicalHistoryContext must be used within a MedicalHistoryContextProvider"
    );
  }
  return context;
};
