import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import { SearchResultDto } from "@easymotion/openapi";
import { Link } from "react-router";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { getStaticImageUrl } from "../../utils/format";

interface PhysiotherapistSearchResultProps {
  physiotherapist: SearchResultDto["physiotherapists"][number];
  onResultClick: () => void;
}

export default function PhysiotherapistSearchResult({
  physiotherapist,
  onResultClick,
}: PhysiotherapistSearchResultProps) {
  return (
    <Card
      component={Link}
      to={`/physiotherapist/${physiotherapist.id}`}
      onClick={onResultClick}
      sx={{
        textDecoration: "none",
        height: "100%",
        display: "flex",
        transition: "all 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          src={getStaticImageUrl(physiotherapist.picturePath ?? "")}
          sx={{ width: 64, height: 64 }}
        />
        <CardContent sx={{ p: 0, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            {physiotherapist.fullName}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            <Chip
              icon={<SchoolIcon />}
              label={physiotherapist.specialization}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<LocationOnIcon />}
              label={physiotherapist.address}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<MenuBookIcon />}
              label={`${physiotherapist.numberOfCourses} corsi`}
              size="small"
              variant="outlined"
            />
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
}
