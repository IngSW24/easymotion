import {
  Box,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";

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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: {
          xs: "calc(100svh - 56px)",
          sm: "calc(100svh - 64px)",
        },
        backgroundImage: `url(/hero.jpg)`,
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={10}
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            zIndex: 1,
            borderRadius: 3,
            boxShadow: theme.shadows[4],
            backgroundColor: "transparent",
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
              backgroundColor: `${theme.palette.primary.main}88`,
              color: theme.palette.primary.contrastText,
              backdropFilter: "blur(5rem)",
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
            sx={{
              padding: 4,
              backgroundColor: `rgba(255, 255, 255, 0.7)`,
              backdropFilter: "blur(300px)",
            }}
          >
            {props.children}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
