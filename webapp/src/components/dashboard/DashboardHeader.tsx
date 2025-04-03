import { Stack } from "@mui/material";
import DashboardBreadCrumbs from "./DashboardBreadCrumbs";

export default function DashboardHeader() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "flex", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 2.5,
      }}
      spacing={2}
    >
      <DashboardBreadCrumbs />
    </Stack>
  );
}
