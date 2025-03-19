import { Delete } from "@mui/icons-material";
import { Button, CardActions } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";

export interface CourseCardProps {
  submitted: boolean;
  onSubscribe?: (id: string, submitted?: boolean) => void;
  onUnsubscribe?: (id: string, submitted?: boolean) => void;
}

export default function SubscribeButton(props: CourseCardProps) {
  const { submitted = false, onSubscribe, onUnsubscribe } = props;

  return (
    <CardActions sx={{ justifyContent: "right", paddingX: 2, fontSize: 20 }}>
      {submitted ? (
        <Button
          startIcon={<Delete />}
          variant="contained"
          color="error"
          sx={{ fontSize: 15 }}
          //onClick={() => onUnsubscribe("", false)}
        >
          Annulla iscrizione
        </Button>
      ) : (
        <Button
          startIcon={<DoneIcon />}
          variant="contained"
          sx={{ fontSize: 20 }}
          //onClick={() => onSubscribe("", true)}
        >
          Iscriviti
        </Button>
      )}
    </CardActions>
  );
}
