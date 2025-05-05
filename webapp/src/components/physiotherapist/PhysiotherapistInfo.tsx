import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Link,
  Typography,
  Avatar,
} from "@mui/material";
import {
  Email,
  Language,
  LocationOn,
  Phone,
  School,
  CalendarToday,
  AccessTime,
} from "@mui/icons-material";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { formatUserName, getStaticImageUrl } from "../../utils/format";
import MarkdownBlock from "../atoms/MarkdownBlock/MarkdownBlock";
import { PhysiotherapistProfileDto } from "@easymotion/openapi";
import { DateTime } from "luxon";

export interface PhysiotherapistInfoProps {
  physiotherapist: PhysiotherapistProfileDto | undefined;
  isLoading: boolean;
}

export default function PhysiotherapistInfo({
  physiotherapist,
  isLoading,
}: PhysiotherapistInfoProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!physiotherapist) {
    return (
      <Typography variant="h6" color="error">
        Fisioterapista non trovato
      </Typography>
    );
  }

  const {
    applicationUser,
    bio,
    specialization,
    publicEmail,
    publicPhoneNumber,
    publicAddress,
    website,
    socialMediaLinks,
  } = physiotherapist;

  return (
    <Card sx={{ mx: "auto", my: 4, boxShadow: 3 }}>
      <CardContent>
        {/* Header Section with Profile Image */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Avatar
            src={getStaticImageUrl(applicationUser.picturePath ?? "")}
            alt={`${applicationUser.firstName} ${applicationUser.lastName}`}
            sx={{
              width: { xs: 100, sm: 120 },
              height: { xs: 100, sm: 120 },
              mx: "auto",
              mb: 2,
              boxShadow: 3,
            }}
          />
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontSize: { xs: "1.5rem", sm: "2.125rem" },
              lineHeight: { xs: 1.2, sm: 1.235 },
            }}
          >
            {formatUserName(applicationUser)}
          </Typography>
          <Chip
            icon={<School />}
            label={specialization}
            color="primary"
            sx={{ mt: 1, mb: 2 }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: 2, sm: 4 },
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              maxWidth: "600px",
              mx: "auto",
              px: { xs: 2, sm: 0 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <CalendarToday color="primary" fontSize="small" />
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Iscritto dal
                </Typography>
                <Typography variant="body2">
                  {DateTime.fromISO(physiotherapist.createdAt).toLocaleString(
                    DateTime.DATE_FULL
                  )}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <AccessTime color="primary" fontSize="small" />
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Ultimo accesso
                </Typography>
                <Typography variant="body2">
                  {physiotherapist.lastLogin
                    ? DateTime.fromISO(
                        physiotherapist.lastLogin
                      ).toLocaleString(DateTime.DATETIME_FULL)
                    : "Mai"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Bio Section */}
        {bio && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Biografia
            </Typography>
            <MarkdownBlock content={bio} />
          </Box>
        )}

        <Divider sx={{ my: 4 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Contatti
          </Typography>
        </Divider>

        {/* Contact Information */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {publicEmail && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flex: "1 1 300px",
                }}
              >
                <Email color="primary" />
                <Link href={`mailto:${publicEmail}`} color="inherit">
                  {publicEmail}
                </Link>
              </Box>
            )}

            {publicPhoneNumber && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flex: "1 1 300px",
                }}
              >
                <Phone color="primary" />
                <Link href={`tel:${publicPhoneNumber}`} color="inherit">
                  {publicPhoneNumber}
                </Link>
              </Box>
            )}
          </Box>

          {publicAddress && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn color="primary" />
              <Typography variant="body1">{publicAddress}</Typography>
            </Box>
          )}

          {website && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Language color="primary" />
              <Link href={website} target="_blank" rel="noopener noreferrer">
                {website}
              </Link>
            </Box>
          )}
        </Box>

        {/* Social Media Links */}
        {socialMediaLinks && socialMediaLinks.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Social Media
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {socialMediaLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none" }}
                >
                  <Chip
                    label={new URL(link).hostname}
                    variant="outlined"
                    clickable
                  />
                </Link>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
