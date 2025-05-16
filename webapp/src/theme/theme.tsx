import { createTheme } from "@mui/material";
import { teal } from "@mui/material/colors";
import { itIT } from "@mui/material/locale";
export const theme = createTheme(
  {
    palette: {
      primary: { main: "#094D95" },
      secondary: teal,
    },
  },
  itIT
);
