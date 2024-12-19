import { Box, Typography } from "@mui/material";

export interface HeroImageProps {
  height?: string;
  backgroundImage?: string;
  title?: string;
  fontWeight?: number;
}

export default function HeroImage(props: HeroImageProps) {
  const {
    title,
    height = "380px",
    backgroundImage = "",
    fontWeight = 600,
  } = props;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      {/* Title positioned at the bottom center */}
      {title && (
        <Box
          sx={{
            position: "absolute",
            // bottom: 0,
            textAlign: "center",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            py: 1,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight,
              color: "white",
              lineHeight: 1.2,
              textAlign: "center",
              letterSpacing: "1px",
              textShadow: "0px 4px 6px rgba(0,0,0,0.5)",
              borderRadius: "8px",
              padding: "10px 20px",
            }}
          >
            {title}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
