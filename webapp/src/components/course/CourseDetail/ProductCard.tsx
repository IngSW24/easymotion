import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface ProductCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

export default function ProductCard(props: ProductCardProps) {
  const { title, value, icon } = props;

  return (
    <Card
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        px: 1,
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(116, 116, 116, 0.24)",
      }}
    >
      {icon && (
        <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
          {icon}
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
