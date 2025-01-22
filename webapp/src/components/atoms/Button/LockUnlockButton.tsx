import { Edit, Save } from "@mui/icons-material";
import { Fab, SxProps, Tooltip } from "@mui/material";

export interface LockUnlockButtonProps {
  isEditing: boolean;
  onClick: () => void;
}

export default function LockUnlockButton(props: LockUnlockButtonProps) {
  const { isEditing, onClick } = props;
  const buttonSx: SxProps = { mr: 1 };

  return (
    <Tooltip
      title={isEditing ? "Salva le modifiche" : "Modifica il corso"}
      arrow
    >
      <Fab
        variant="extended"
        sx={{ minWidth: "13rem" }}
        color={isEditing ? "success" : "primary"}
        onClick={onClick}
      >
        {isEditing ? <Save sx={buttonSx} /> : <Edit sx={buttonSx} />}
        {isEditing ? "Salva" : "Modalità modifica"}
      </Fab>
    </Tooltip>
  );
}
