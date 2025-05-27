import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import { Download } from "@mui/icons-material";
import { useApiClient } from "@easymotion/auth-context";
import { useState } from "react";

export interface DownloadPatientPDFProps {
  userId: string;
}

export default function DownloadPatientPDF(props: DownloadPatientPDFProps) {
  const { apiClient } = useApiClient();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const downloadPDF = async () => {
    setIsDownloading(true);

    const response = await apiClient.users.usersControllerFindMedicalHistory(
      props.userId
    );

    // La risposta è un Blob (Binary Large Object) che rappresenta il file
    const blob = await response.blob();

    // Estrai il nome del file dall'header Content-Disposition se presente
    // Altrimenti usa un nome predefinito
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = "downloaded_file"; // Nome di default
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    // Crea un URL per il Blob
    const url = window.URL.createObjectURL(blob);

    // Crea un elemento <a> nascosto per innescare il download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // Imposta il nome del file per il download
    document.body.appendChild(a); // Aggiungi l'elemento al DOM (necessario per Firefox)
    a.click(); // Simula un click per avviare il download

    // Rimuovi l'elemento <a> e revoca l'URL del Blob per liberare memoria
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setIsDownloading(false);
  };

  return (
    <Tooltip title="Scarica cartella clinica">
      {isDownloading ? (
        <CircularProgress />
      ) : (
        <IconButton onClick={downloadPDF}>
          <Download fontSize="small" />
        </IconButton>
      )}
    </Tooltip>
  );
}
