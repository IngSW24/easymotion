import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { SnackbarKey, useSnackbar } from "notistack";

export default function SnackbarCloseButton({
  snackbarKey,
}: {
  snackbarKey: SnackbarKey;
}) {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(snackbarKey)} size="small">
      <Close />
    </IconButton>
  );
}
