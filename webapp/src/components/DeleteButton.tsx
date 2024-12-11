import { Button } from "@mui/material";
import React from "react";
import DeleteDialog from "./DeleteDialog";

const API_URL = "https://api.easymotion.devlocal";

interface DeleteButtonProps {
  id: string;
}

/**
 * Cancella il corso id chiamando la funzione apposita dalla API
 */
export async function deleteCourse(id: string | null) {
  if (!id) return;

  fetch(`${API_URL}/courses/${id}`, { method: "DELETE" }).then(() => {
    window.location.reload();
  });
}

function deleteButton(props: DeleteButtonProps) {
  const { id } = props; //ID del corso a cui è associato il pulsante, passato come argomento per cancellare il corso in questione

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true); //APRE la finestra di Dialog
  };

  const handleCloseClose = () => {
    setOpen(false); //CHIUDE la finestra di Dialog
  };

  const handleCloseCancel = () => {
    setOpen(false); //CHIUDE la finestra di Dialog

    deleteCourse(id); //Funzione che cancella dal Database il corso in questione (il cui ID è stato passato come argomento)
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen}>
        Cancella corso "{id}"
      </Button>

      <DeleteDialog
        id={open ? id : null}
        handleCloseAnnulla={handleCloseClose}
        handleCloseCancella={handleCloseCancel}
      />
    </React.Fragment>
  );
}

export default deleteButton;
