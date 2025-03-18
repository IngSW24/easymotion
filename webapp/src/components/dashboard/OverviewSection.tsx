import {
  AccessTime,
  AttachMoney,
  FitnessCenter,
  People,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";

const cards = [
  {
    title: "Total courses",
    value: "24",
    icon: <FitnessCenter />,
  },
  {
    title: "Active patience",
    value: "156",
    icon: <People />,
  },
  {
    title: "Hour this mounth",
    value: "89",
    icon: <AccessTime />,
  },
  {
    title: "Revenue",
    value: "$4.290",
    icon: <AttachMoney />,
  },
];

export default function OverviewSection() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
        gap: 2,
      }}
    >
      {cards.map((card, index) => (
        <Card key={index}>
          <CardActionArea
            sx={{
              height: "100%",
              "&:hover": {
                backgroundColor: "action.selectedHover",
              },
            }}
          >
            <CardContent sx={{ height: "100%" }}>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="div"
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {card.value}
                  </Typography>
                </Box>
                <IconButton color="primary" disableRipple>
                  {card.icon}
                </IconButton>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
