import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { AnimatedButton, ContentWrapper, HeroSection } from "./styled";
import { PersonAdd } from "@mui/icons-material";
import { useEffect, useState } from "react";

export interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage: string;
  fallbackImage?: string;
  showSignupButton?: boolean;
  minHeight?: string | number;
  opacity?: number;
}

export default function Hero(props: HeroProps) {
  const {
    title,
    subtitle,
    backgroundImage,
    fallbackImage,
    showSignupButton = false,
  } = props;

  const navigate = useNavigate();

  const handleRegisterClick = () => navigate("/signup");

  const [bgImage, setBgImage] = useState(backgroundImage);

  useEffect(() => {
    if (!fallbackImage) return;
    const img = new Image();
    img.src = backgroundImage;
    img.onerror = () => setBgImage(fallbackImage);
  }, [backgroundImage, fallbackImage]);

  return (
    <HeroSection
      opacity={props.opacity}
      sx={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: props.minHeight || "25rem",
      }}
      role="banner"
    >
      {(title || subtitle) && (
        <ContentWrapper maxWidth="lg">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem" },
                fontWeight: 800,
                mb: 2,
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                  fontWeight: 400,
                  mb: 4,
                  maxWidth: "800px",
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                {subtitle}
              </Typography>
            )}

            {showSignupButton && (
              <Box sx={{ mt: 4 }}>
                <AnimatedButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<PersonAdd />}
                    onClick={handleRegisterClick}
                    sx={{
                      color: "white",
                      fontSize: "large",
                      px: 4,
                      py: 1.2,
                      borderRadius: "20px",
                    }}
                  >
                    Iscriviti
                  </Button>
                </AnimatedButton>
              </Box>
            )}
          </motion.div>
        </ContentWrapper>
      )}
    </HeroSection>
  );
}
