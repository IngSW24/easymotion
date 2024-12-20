import React, { useState } from "react";
import { Card, CardContent, Typography, Box, TextField } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EuroIcon from "@mui/icons-material/Euro";
import { CourseEntity } from "../../../../client/data-contracts";

interface ProductCardProps {
  typeInfo: string; // Indicates the label of each information, e.g., organizer, time, ...
  info?: string; // Indicates the related information
  cost?: number; // Cost field
  field: keyof CourseEntity; // Indicates the field to update
  isEditing: boolean; // External control for edit mode
  onSave: (field: string, value: string | number) => void; // Function to handle saving
}

/**
 * Creates the ProductCard
 * @param {string} typeInfo - The label of the information to determine the icon
 * @param {string} info - The actual information to display
 * @param {number} cost - The cost information to display if applicable
 * @param {boolean} isEditing - Determines if the component is in edit mode
 * @param {Function} onSave - Callback to handle saving the updated data
 * @returns A card showing the course information with an appropriate icon
 */
const ProductCard: React.FC<ProductCardProps> = ({
  typeInfo,
  info,
  cost,
  field,
  isEditing,
  onSave,
}) => {
  const [editedInfo, setEditedInfo] = useState(info);
  const [editedCost, setEditedCost] = useState(cost);

  // This function returns the icon depending on the information type
  const getIcon = (type: string) => {
    switch (type) {
      case "Istruttori":
        return <FitnessCenterIcon sx={{ fontSize: 48, color: "#5c6bc0" }} />;
      case "Posizione":
        return <LocationOnIcon sx={{ fontSize: 48, color: "#5c6bc0" }} />;
      case "Costo":
        return <EuroIcon sx={{ fontSize: 48, color: "#5c6bc0" }} />;
      default:
        return null;
    }
  };

  // Handle saving the edited information or cost
  const handleSave = () => {
    if (info !== undefined && editedInfo !== info) {
      onSave(field, editedInfo || "");
    }
    if (cost !== undefined && editedCost !== cost) {
      onSave(field, editedCost || 0);
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
        backgroundColor: "rgba(116, 116, 116, 0.24)",
        mb: 1,
      }}
    >
      <Box sx={{ marginRight: 2 }}>{getIcon(typeInfo)}</Box>

      <CardContent sx={{ padding: "0", marginTop: 1, flex: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {typeInfo}
        </Typography>
        {isEditing ? (
          <Box>
            {info !== undefined ? (
              <TextField
                label={typeInfo}
                name="information"
                value={editedInfo}
                onChange={(e) => setEditedInfo(e.target.value)}
                onBlur={handleSave}
                fullWidth
                margin="normal"
              />
            ) : cost !== undefined ? (
              <TextField
                label={typeInfo}
                name="cost"
                value={editedCost}
                onChange={(e) => setEditedCost(Number(e.target.value))}
                onBlur={handleSave}
                fullWidth
                margin="normal"
              />
            ) : null}
          </Box>
        ) : (
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            {info ?? `${cost} euro`}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
