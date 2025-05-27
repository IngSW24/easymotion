import { createContext } from "react";

export type MedicalHistoryContextProps = {
  openDialog: () => void;
};

export const MedicalHistoryContext = createContext<MedicalHistoryContextProps>(
  {} as MedicalHistoryContextProps
);
