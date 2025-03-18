import { Box, Stack } from "@mui/material";
import SideMenu from "../../components/dashboard/SideMenu";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardHome from "./Home";

export default function Dashboard() {
  return (
    <Box sx={{ display: "flex" }}>
      <SideMenu />
      {/* Main content */}
      <Box component="main" flexGrow="1" overflow="auto">
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          <DashboardHeader />
          <DashboardHome />
        </Stack>
      </Box>
    </Box>
  );
}
