import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface ProductCardProps {
  typeInfo: string; // it indicates the label of each information, ex organizer, time, ...
  info: string; // it indicates the related information
}

/**
 * Creates the ProductCard
 * @param {string} typeInfo - Type of the information to determine the icon
 * @param {string} info - The actual information to display
 * @returns A card showing the course information with an appropriate icon
 */
const ProductCard: React.FC<ProductCardProps> = ({ typeInfo, info }) => {
  // This function returns the icon depending on the information type
  const getIcon = (type: string) => {
    switch (type) {
      case "Organizzatore":
        return (
          <CheckCircleOutlineIcon sx={{ fontSize: 48, color: "#5c6bc0" }} />
        );
      case "Appuntamenti":
        return <AccessTimeIcon sx={{ fontSize: 48, color: "#5c6bc0" }} />;
      default:
        return null;
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "8px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: 500,
      }}
    >
      <Box sx={{ marginRight: 2 }}>{getIcon(typeInfo)}</Box>

      <CardContent sx={{ padding: "0", marginTop: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {typeInfo}
        </Typography>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", marginBottom: "8px" }}
        >
          {info}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

{
  /**<ProductCard typeInfo="Appuntamenti" info="Pittis Matteo"></ProductCard>*/
}
