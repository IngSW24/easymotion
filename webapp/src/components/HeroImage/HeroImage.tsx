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
        position: "relative", // Ensures children can be absolutely positioned
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
            position: "absolute", // Allows positioning over the background
            top: 0, // Align to the top
            left: 0,
          }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight,
              color: "white",
              lineHeight: 2,
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
            <Typography variant="h3" component="div">
              EASYMOTION
            </Typography>
            {title}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          position: "absolute", // Allows flexible positioning of the button
          bottom: "16px", // Places the button near the bottom
          width: "100%", // Center-align horizontally
          display: "flex",
          justifyContent: "center", // Center-align horizontally
        }}
      ></Box>
    </Box>
  );
}
