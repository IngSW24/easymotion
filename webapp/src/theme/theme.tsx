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

// inverted colors
export const notLoggedTheme = createTheme({
  palette: {
    primary: { main: "#404a86" },
    secondary: teal,
  },
});
