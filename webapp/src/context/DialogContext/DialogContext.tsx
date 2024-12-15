import { createContext, ReactNode } from "react";

export type DialogContextProps = {
  title: string;
  content: ReactNode;
  confirmText?: string;
  cancelText?: string;
};

type DialogContextType = {
  showConfirmationDialog: (options: DialogContextProps) => Promise<boolean>;
};

export const DialogContext = createContext<DialogContextType | undefined>(
  undefined
);
