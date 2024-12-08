import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";



export default function DeleteDialog( {id, handleCloseAnnulla, handleCloseCancella}: {id: string | null, handleCloseAnnulla: () => void, handleCloseCancella: () => void} ) {



    return( id?
            <Dialog
                open={true}
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
            : 
            <div></div>
    );
}