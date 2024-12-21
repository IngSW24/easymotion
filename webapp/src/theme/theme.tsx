import { createTheme } from "@mui/material";
import { teal } from "@mui/material/colors";

export const userTheme = createTheme({
  palette: {
    primary: teal,
    secondary: {
      main: "#404a86",
    },
  },
});

// Theme for the physiotherapist inverts colors
export const physiotherapistTheme = createTheme({
  palette: {
    primary: { main: "#404a86" },
    secondary: teal,
  },
});
