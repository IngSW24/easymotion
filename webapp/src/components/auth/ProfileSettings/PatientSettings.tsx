import { Person } from "@mui/icons-material";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";

export default function PatientSettings() {
  return (
    <Card
      sx={{
        width: "100%",
        margin: "auto",
        boxShadow: 3,
        borderRadius: 3,
        padding: 3,
      }}
    >
      <CardContent>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginBottom: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Person />{" "}
            {/* Using Person as the icon component to reflect personal data */}
            <Typography variant="h5" fontWeight="bold">
              Dati Sanitari
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ marginY: 2 }} />

        <Typography variant="h6" fontWeight="bold">
          Campi da aggiungere
        </Typography>
      </CardContent>
    </Card>
  );
}
