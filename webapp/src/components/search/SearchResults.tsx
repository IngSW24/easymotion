import {
  Box,
  CircularProgress,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import { SearchResultDto } from "@easymotion/openapi";
import PhysiotherapistSearchResult from "./PhysiotherapistSearchResult";
import CourseSearchResult from "./CourseSearchResult";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";

interface SearchResultsProps {
  results?: SearchResultDto;
  isLoading: boolean;
  onResultClick: () => void;
}

export default function SearchResults({
  results,
  isLoading,
  onResultClick,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!results) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="text.secondary">
          Inizia a digitare per cercare fisioterapisti e corsi
        </Typography>
      </Box>
    );
  }

  const hasResults =
    results.physiotherapists?.length > 0 || results.courses?.length > 0;

  if (!hasResults) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="text.secondary">Nessun risultato trovato</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {results.physiotherapists && results.physiotherapists.length > 0 && (
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              color: "white",
              "& .MuiAccordionSummary-expandIconWrapper": {
                color: "white",
              },
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <PeopleIcon />
              <Typography variant="h6">
                Fisioterapisti ({results.physiotherapists.length})
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {results.physiotherapists.map((physio) => (
                <PhysiotherapistSearchResult
                  key={physio.id}
                  physiotherapist={physio}
                  onResultClick={onResultClick}
                />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

      {results.courses && results.courses.length > 0 && (
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              color: "white",
              "& .MuiAccordionSummary-expandIconWrapper": {
                color: "white",
              },
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <SchoolIcon />
              <Typography variant="h6">
                Corsi ({results.courses.length})
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {results.courses.map((course) => (
                <CourseSearchResult
                  key={course.id}
                  course={course}
                  onResultClick={onResultClick}
                />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
}
