import { Typography } from "@mui/material";
import { useParams } from "react-router";

export default function PhysioRegisterPage() {
  const { inviteId } = useParams();

  return (
    <Typography>
      Physio register page, invite id: {inviteId ?? "NO INVITE ID"}
    </Typography>
  );
}
