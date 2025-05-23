import {
  Box,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Drawer as MuiDrawer,
} from "@mui/material";
import { FormatListBulleted, SpaceDashboard } from "@mui/icons-material";
import { Link, Outlet, useLocation } from "react-router";
import Fade from "../animations/Fade";

const drawerWidth = 240;

const menuItems = [
  {
    label: "Home",
    icon: <SpaceDashboard />,
    route: "/dashboard",
  },
  {
    label: "Corsi",
    icon: <FormatListBulleted />,
    route: "/dashboard/courses",
  },
];

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

export default function DashboardLayout() {
  const location = useLocation();
  return (
    <Box sx={{ display: "flex" }}>
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
          <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
            <List dense>
              {menuItems.map((item, i) => (
                <ListItem key={i} disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    component={Link}
                    to={item.route}
                    selected={location.pathname === item.route}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Stack>
        </Box>
      </Drawer>

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
          <Fade>
            <Outlet />
          </Fade>
        </Stack>
      </Box>
    </Box>
  );
}
