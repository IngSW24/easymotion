import { Edit, Save } from "@mui/icons-material";
import { Fab, SxProps, Tooltip } from "@mui/material";

export interface LockUnlockButtonProps {
  isEditing: boolean;
  onClick: () => void;
}

export default function LockUnlockButton(props: LockUnlockButtonProps) {
  const buttonSx: SxProps = { mr: 1 };

  return (
    <Tooltip
      title={props.isEditing ? "Salva le modifiche" : "Modifica il corso"}
      arrow
    >
      <Fab
        variant="extended"
        sx={{ minWidth: "13rem" }}
        color={props.isEditing ? "success" : "primary"}
        onClick={props.onClick}
      >
        {props.isEditing ? <Save sx={buttonSx} /> : <Edit sx={buttonSx} />}
        {props.isEditing ? "Salva" : "Modalità modifica"}
      </Fab>
    </Tooltip>
  );
}
