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
    height = "320px",
    backgroundImage = "",
    fontWeight = 600,
  } = props;

  return (
    <Box
      sx={{
        width: "100%",
        height,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url('${backgroundImage}')`,
        overflow: "hidden", // Prevents content overflow
        boxSizing: "border-box", // Ensures padding/border stay within width
      }}
    >
      {title && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.7)",
            padding: "0 16px", // Add horizontal padding for safety
            boxSizing: "border-box", // Prevents overflow from padding
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
              padding: "10px 20px", // Standard padding
              maxWidth: "100%", // Prevents overflow
              whiteSpace: "normal", // Allows text to wrap naturally
              overflowWrap: "break-word", // Wraps long words
              wordBreak: "break-word", // Breaks long words
            }}
          >
            {title}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
