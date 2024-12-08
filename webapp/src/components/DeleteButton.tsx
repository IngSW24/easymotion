import { Button } from "@mui/material";
import React from "react";
import DeleteDialog from "./DeleteDialog";

const API_URL = "https://api.easymotion.devlocal"

interface DeleteButtonProps {
    id: string;
}

/**
 * Cancella l'evento id chiamando la funzione apposita dalla API
 */
export async function cancellaEvento(id: string | null) {
    if (!id) return
    
    fetch(`${API_URL}/events/${id}`, {method: "DELETE"}).then(() => {
        window.location.reload()
    });
}

export default function DeleteButton (props: DeleteButtonProps) {

    const {id} = props;   //ID dell'evento a cui è associato il pulsante, passato come argomento per cancellare l'evento in questione 

    const [open, setOpen] = React.useState(false);


    const handleClickOpen = () => {
        setOpen(true);     //APRE la finestra di Dialog
    };
    

    const handleCloseAnnulla = () => {
        setOpen(false);     //CHIUDE la finestra di Dialog

    };

    const handleCloseCancella = () => {
        setOpen(false);     //CHIUDE la finestra di Dialog

        cancellaEvento(id);   //Funzione che cancella dal Database l'evento in questione (il cui ID è stato passato come argomento)
    }

    return(
       <React.Fragment>
            <Button variant="contained" onClick={handleClickOpen}>
                Cancella evento "{id}"
            </Button>

            <DeleteDialog id={open ? id : null} handleCloseAnnulla={handleCloseAnnulla} handleCloseCancella={handleCloseCancella} />

       </React.Fragment> 
    );
    
};


//Esempio di bottone funzionante (con passaggio di valori): https://stackblitz.com/edit/react-starter-typescript?file=components%2FButtonCounter.tsx