import { SpaceDashboard } from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

export interface MenuContentProps {
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
}

const menuItems = [
  {
    label: "Home",
    icon: <SpaceDashboard />,
    id: "home",
  },
  {
    label: "Corsi",
    icon: <FormatListBulletedIcon />,
    id: "corsi",
  },
];

export default function MenuContent(props: MenuContentProps) {
  const { activeSection, setActiveSection } = props;

  const handleMenuClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={activeSection === item.id}
              onClick={() => handleMenuClick(item.id)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
