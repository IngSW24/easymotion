import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";


interface DeleteButtonProps {
    id: string;
}

export const cancellaEvento = (id:string) => {
        
    /**
    
    Qui verrà usata la funzione "async remove(id: string)"
    che si trova nel file di back-end "api/src/events/events.service.ts"

     */
    fetch(`https://api.easymotion.devlocal/events/${id}`, {method: "DELETE"});


};


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

            <Dialog
                open={open}
                keepMounted
                onClose={handleCloseAnnulla}        //Se cliccki fuori dalla finestra <Dialog> allora verrà eseguita la funzione "handleCloseAnnulla"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Vuoi cancellare questo evento?"}</DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Se premi su "Cancella" il seguente evento "{id}" e tutti i dati relativi ad esso verranno cancellati.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button variant="contained" onClick={handleCloseCancella}>Cancella</Button>
                    <Button onClick={handleCloseAnnulla}>Annulla</Button>
                </DialogActions>

            </Dialog>

       </React.Fragment> 
    );
    
};


//Esempio di bottone funzionante (con passaggio di valori): https://stackblitz.com/edit/react-starter-typescript?file=components%2FButtonCounter.tsx