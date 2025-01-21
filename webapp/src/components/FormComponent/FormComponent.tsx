import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";

export interface FieldProps<T> {
  key: keyof T;
  label: string;
  type: string;
}

interface FormProps<T> {
  title: string;
  description: string;
  textFieldNumber: number;
  fieldName: FieldProps<T>[];
  errorMessage?: string;
  checkboxRequired?: boolean;
  checkboxName?: string;
  buttonName: string;
  onSubmit?: (value: Record<string, string>) => void;
}

export default function FormComponent<T extends object>(prop: FormProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    if (prop.onSubmit) {
      prop.onSubmit(data);
    }
  };

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
          width: "100%",
          maxWidth: 1200,
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
            {prop.title}
          </Typography>

          <Typography variant="body1" sx={{ fontSize: "18px" }}>
            {prop.description}
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
          }}
        >
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Box display="flex" flexDirection="column" gap={3} width="100%">
              {/* Form Fields */}
              {prop.fieldName.map((field, index) => (
                <TextField
                  key={index}
                  label={field.label}
                  name={field.key.toString()}
                  required
                  fullWidth
                  type={field.type}
                  variant="outlined"
                  InputProps={{
                    style: { fontSize: "16px" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                />
              ))}

              {/* Error Message */}
              {prop.errorMessage && (
                <Typography color="error" variant="body2">
                  {prop.errorMessage}
                </Typography>
              )}

              {/* Checkbox */}
              {prop.checkboxName && (
                <FormControlLabel
                  control={
                    <Checkbox name="terms" required={prop.checkboxRequired} />
                  }
                  label={prop.checkboxName}
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "14px",
                    },
                  }}
                />
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  padding: "12px 20px",
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                {prop.buttonName}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
