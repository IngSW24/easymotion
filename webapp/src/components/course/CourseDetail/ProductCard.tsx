import React, { useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EuroIcon from "@mui/icons-material/Euro";
import { Person } from "@mui/icons-material";
import FormTextField from "../../atoms/TextField/FormTextField";

interface ProductCardProps {
  typeInfo: string; // Indicates the label of each information, e.g., organizer, time, ...
  info?: string; // Indicates the related information
  cost?: number; // Cost field
  isEditing: boolean; // External control for edit mode
  onSave: (value: string | number) => void; // Function to handle saving
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
  isEditing,
  onSave,
}: ProductCardProps) => {
  const [editedInfo, setEditedInfo] = useState(info);
  const [editedCost, setEditedCost] = useState(cost);

  // This function returns the icon depending on the information type
  const getIcon = (type: string) => {
    switch (type) {
      case "Istruttori":
        return <Person sx={{ fontSize: 48, color: "secondary.dark" }} />;
      case "Posizione":
        return (
          <LocationOnIcon sx={{ fontSize: 48, color: "secondary.dark" }} />
        );
      case "Costo":
        return <EuroIcon sx={{ fontSize: 48, color: "secondary.dark" }} />;
      default:
        return null;
    }
  };

  // Handle saving the edited information or cost immediately onChange
  const handleChangeInfo = (value: string) => {
    setEditedInfo(value);
    onSave(value || "");
  };

  const handleChangeCost = (value: number) => {
    const positiveValue = value < 0 ? 0 : value;
    setEditedCost(positiveValue);
    onSave(positiveValue || 0);
  };

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
      <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
        {getIcon(typeInfo)}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {!isEditing && (
            <Typography variant="body2" color="text.secondary">
              {typeInfo}
            </Typography>
          )}
          {isEditing ? (
            <Box>
              {info !== undefined ? (
                <FormTextField
                  label={typeInfo}
                  value={editedInfo ?? ""}
                  onChange={(v) => handleChangeInfo(v)}
                />
              ) : cost !== undefined ? (
                <FormTextField
                  label={typeInfo}
                  type="number"
                  value={editedCost ? editedCost.toString() : "0"}
                  onChange={(v) => handleChangeCost(Number(v))}
                />
              ) : null}
            </Box>
          ) : (
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {info ?? `${cost} euro`}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
