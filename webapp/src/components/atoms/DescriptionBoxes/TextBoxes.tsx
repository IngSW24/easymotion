import { Box } from "@mui/material";

export interface TextBoxesProps {
  descriptionTitle: string;
  description: string;
}

export default function TextBoxes(props: TextBoxesProps) {
  const { descriptionTitle, description } = props;

  return (
    <div style={{ padding: 10 }}>
      <h2>{descriptionTitle}:</h2>

      <Box
        sx={{
          padding: 2,
          bgcolor: "white",
          borderStyle: "solid",
          borderColor: "black",
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        {description}
      </Box>
    </div>
  );
}
