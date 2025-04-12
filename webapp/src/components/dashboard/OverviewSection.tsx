import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Icon,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";

type CardProps = {
  title: string;
  value: number;
  icon: ReactNode;
};

type OverviewSectionProps = {
  cards: CardProps[];
};

export default function OverviewSection(props: OverviewSectionProps) {
  const { cards } = props;

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
                <Icon color="primary">{card.icon}</Icon>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
