import { Edit, Save } from "@mui/icons-material";
import { Fab, SxProps } from "@mui/material";

export interface LockUnlockButtonProps {
  isEditing: boolean;
  onClick: () => void;
}

export default function LockUnlockButton(props: LockUnlockButtonProps) {
  const buttonSx: SxProps = { mr: 1 };

  return (
    <Fab
      variant="extended"
      sx={{ minWidth: "13rem" }}
      color={props.isEditing ? "success" : "secondary"}
      onClick={props.onClick}
    >
      {props.isEditing ? <Save sx={buttonSx} /> : <Edit sx={buttonSx} />}
      {props.isEditing ? "Salva" : "Modalità modifica"}
    </Fab>
  );
}