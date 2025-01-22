import { Box, Container, styled } from "@mui/material";
import { motion } from "framer-motion";

export const HeroSection = styled(Box)(() => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 1,
  },
}));

export const ContentWrapper = styled(Container)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  color: "#fff",
  textAlign: "center",
  padding: theme.spacing(4),
}));

export const AnimatedButton = styled(motion.div)(({ theme }) => ({
  display: "inline-block",
  margin: theme.spacing(1),
}));
