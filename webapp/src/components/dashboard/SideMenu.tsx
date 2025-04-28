import { Box, styled } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MenuContent from "./MenuContent";

const drawerWidth = 240;

export interface SideMenuProps {
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
}

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .MuiDrawer-paper`]: {
    width: drawerWidth,
    boxSizing: "border-box",
    top: "64px",
    height: "calc(100% - 64px)",
  },
});

export default function SideMenu(props: SideMenuProps) {
  const { activeSection, setActiveSection } = props;
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        backgroundColor: "Menu",
      }}
    >
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </Box>
    </Drawer>
  );
}
