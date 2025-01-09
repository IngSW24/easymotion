import { Box, CircularProgress } from "@mui/material";

export default function LoadingSpinner() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        mt: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
