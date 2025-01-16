import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel,
  } from "@mui/material";
  
  interface FormProp {
    title: string;
    description: string;
    textFieldNumber: number;
    flexDirectionParam: "column" | "row";
    fieldName?: string[];
    checkbox?: boolean;
    checkboxName?: string;
    buttonName: string;
  }
  
  export default function FormComponent(prop: FormProp) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 600 }}>
          <form>
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: "40px",
                  color: "primary.main",
                  lineHeight: 1.2,
                  textAlign: "center",
                  letterSpacing: "1px",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  maxWidth: "100%",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {prop.title}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: "20px",
                  color: "black",
                  lineHeight: 1.2,
                  textAlign: "center",
                  letterSpacing: "1px",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  maxWidth: "100%",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {prop.description}
              </Typography>
            </Box>
            <Box display="flex" flexDirection={prop.flexDirectionParam} gap={2}>
              {prop.fieldName && prop.fieldName.length > 0
                ? prop.fieldName.map((name, index) => (
                    <TextField
                      key={`field-${index}`}
                      label={name}
                      name={name}
                      required
                      fullWidth
                      type={name.toLowerCase().includes("password") ? "password" : "text"}
                    />
                  ))
                : Array.from({ length: prop.textFieldNumber }, (_, index) => (
                    <TextField
                      key={`field-${index}`}
                      label={`Field ${index + 1}`}
                      name={`field-${index}`}
                      required
                      fullWidth
                    />
                  ))}
            </Box>
            <Box display="flex" flexDirection="column" gap={2}>
              {prop.checkbox && (
                <FormControlLabel
                  control={<Checkbox name="terms" required />}
                  label={prop.checkboxName}
                />
              )}
            </Box>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                sx={{
                  height: "40px",
                  top: "10px",
                  backgroundColor: "primary.main",
                  color: "#fff",
                }}
              >
                {prop.buttonName}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    );
  }
  