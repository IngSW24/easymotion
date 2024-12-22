import { Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";

export default function CreateCourseButton() {
  const navigate = useNavigate();

  const handleFabClick = () => {
    navigate("/physio/new");
  };

  return (
    <Tooltip title="Crea un corso" arrow>
      <Fab
        color="primary"
        sx={{
          position: "fixed", // Mantiene il pulsante in una posizione fissa
          bottom: 20, // Margine dal basso
          right: 20, // Margine da destra
          width: 70, // Larghezza del bottone
          height: 70, // Altezza del bottone
          "& svg": {
            fontSize: 30, // Dimensione dell'icona
          },
        }}
        onClick={handleFabClick} // Azione al clic
        aria-label="Add"
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  );
}
