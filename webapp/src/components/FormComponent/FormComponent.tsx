import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
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
        padding: 4,
        minHeight: "90vh",
        backgroundImage: `url(/hero.jpg)`, // Add background image to the general box
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1200,
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          backgroundColor: "white",
          overflow: "hidden", // Ensures the child boxes respect the borders of the paper
        }}
      >
        {/* Left section with background color/image */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={3}
          sx={{
            paddingTop: 4,
            paddingBottom: 4,
            color: "#fff",
            textAlign: "center",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "primary.main",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: "37px",
              fontWeight: "bold",
              fontFamily: "Roboto Slab",
              color: "#fff",
            }}
          >
            {prop.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "22px",
              marginBottom: 2,
              fontFamily: "Roboto Slab",
              color: "#fff",
            }}
          >
            {prop.description}
          </Typography>
        </Box>

        {/* Right section with form fields */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          sx={{
            padding: 4, // Adds padding inside the form
          }}
        >
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Box display="flex" flexDirection="column" gap={3} width="100%">
              <Box display="flex" flexDirection="column" gap={2} width="100%">
                {prop.fieldName.map((data: FieldProps<T>, index: number) => (
                  <TextField
                    key={index}
                    label={data.label}
                    name={data.key.toString()}
                    required
                    fullWidth
                    type={data.type}
                  />
                ))}
              </Box>

              {prop.errorMessage && (
                <Typography color="error">Error</Typography>
              )}

              {prop.checkboxName && (
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <FormControlLabel
                    control={
                      <Checkbox name="terms" required={prop.checkboxRequired} />
                    }
                    label={prop.checkboxName}
                  />
                </Box>
              )}

              <Box display="flex" flexDirection="column" gap={2} width="100%">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "primary.main",
                    color: "#fff",
                    padding: "10px 20px",
                    fontWeight: "bold",
                    textTransform: "none",
                    fontSize: "16px",
                  }}
                >
                  {prop.buttonName}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
