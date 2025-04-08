import { Box, Button, Modal } from "@mui/material";
import React from "react";

export default function SubscriptionRequest() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>Subscription Request</Button>
      <Modal open={open} onClose={handleClose}>
        <Box>Richiesta d'iscrizione al corso</Box>
      </Modal>
    </>
  );

  //Link con istruzioni su come usare Modal (Popup overlay): https://mui.com/material-ui/react-modal/?srsltid=AfmBOooX7xJ4MW01JyLwJM9_A0U9KWfhmiU9nQx48ZjwuWXV9c-oj-tN
}
