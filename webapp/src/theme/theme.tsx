import { createTheme } from "@mui/material";
import { teal } from "@mui/material/colors";

// TODO: improve themes

export const notLoggedTheme = createTheme({
  palette: {
    primary: teal,
    secondary: {
      main: "#404a86",
    },
  },
});

export const userTheme = createTheme({
  palette: {
    primary: { main: "#404a86" },
    secondary: teal,
  },
});

export const physioTheme = createTheme({
  palette: {
    primary: { main: "#704a86" },
    secondary: teal,
  },
});

export const adminTheme = createTheme({
  palette: {
    primary: { main: "#700a86" },
    secondary: teal,
  },
});
