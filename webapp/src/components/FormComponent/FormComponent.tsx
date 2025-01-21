import { Box, Paper, Typography, useTheme, useMediaQuery } from "@mui/material";

export interface FieldProps<T> {
  key: keyof T;
  label: string;
  type: string;
}

interface FormComponentProps {
  title: string;
  text: string;
  children: React.ReactNode;
}

export default function FormComponent(props: FormComponentProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: `calc(100vh - ${Number(theme.mixins.toolbar.minHeight) * 2}px)`,
        backgroundImage: `url(/hero.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          maxWidth: "80rem",
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          overflow: "hidden",
          boxShadow: theme.shadows[4],
        }}
      >
        {/* Left Section */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={2}
          sx={{
            padding: 4,
            textAlign: "center",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {props.title}
          </Typography>

          <Typography variant="body1" sx={{ fontSize: "18px" }}>
            {props.text}
          </Typography>
        </Box>

        {/* Right Section */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          sx={{ padding: 4 }}
        >
          {props.children}
        </Box>
      </Paper>
    </Box>
  );
}
