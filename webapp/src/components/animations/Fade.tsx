import { Box } from "@mui/material";
import { useLocation } from "react-router";

export interface FadeProps {
  children: React.ReactNode | React.ReactNode[];
}
export default function Fade(props: FadeProps) {
  const location = useLocation();
  return (
    <Box
      className="fade"
      sx={{ width: "100%", height: "100%" }}
      key={location.pathname}
    >
      {props.children}
    </Box>
  );
}
