import { Box, Stack } from "@mui/material";
import { useState } from "react";
import SideMenu from "../../components/dashboard/SideMenu";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardHome from "./Home";
import CoursesDashboard from "./CoursesDashboard";

export default function Dashboard() {
  // Stato per tenere traccia della sezione attualmente selezionata
  const [activeSection, setActiveSection] = useState("home");

  // Funzione per renderizzare il contenuto in base alla sezione attiva
  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <DashboardHome />;
      case "corsi":
        return <CoursesDashboard />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Passa la sezione attiva e il setter al menu */}
      <SideMenu
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

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
          {/* Render del contenuto dinamico */}
          {renderContent()}
        </Stack>
      </Box>
    </Box>
  );
}
