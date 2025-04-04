import { Add, Delete } from "@mui/icons-material";
import { Box, Button, IconButton, Stack } from "@mui/material";
import FormTextField from "../../atoms/TextField/FormTextField";

export interface ListEditorProps {
  entries: string[];
  onChange: (entries: string[]) => void;
  entryIcon: React.ReactElement;
  buttonText: string;
}

export default function ListEditor(props: ListEditorProps) {
  const { entries, onChange, entryIcon, buttonText } = props;

  const addEntry = () => {
    onChange([...entries, ""]);
  };

  const updateEntry = (text: string, index: number) => {
    onChange(entries.map((entry, i) => (i === index ? text : entry)));
  };

  const deleteEntry = (index: number) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  return (
    <>
      <Stack spacing={3} sx={{ mt: 3 }}>
        {entries.map((item, index) => (
          <Stack
            key={`schedule-${index}`}
            direction="row"
            spacing={2}
            alignItems="center"
          >
            {entryIcon}
            <>
              <FormTextField
                id={`outlined-basic-${index}`}
                value={item}
                onChange={(v) => updateEntry(v, index)}
              />
              <IconButton color="error" onClick={() => deleteEntry(index)}>
                <Delete />
              </IconButton>
            </>
          </Stack>
        ))}
      </Stack>

      <Box justifyContent="flex-start" mt={2}>
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          onClick={addEntry}
        >
          {buttonText}
        </Button>
      </Box>
    </>
  );
}
