import {
  Box,
  Container,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Paper,
  Collapse,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowUpward, FilterList } from "@mui/icons-material";
import { useState } from "react";
import CheckboxSelector from "./CheckboxSelector";
import { CourseFilters } from "./types";
import {
  courseAvilabilities,
  courseCategories,
  courseFrequencies,
  courseLevels,
} from "../../../data/courseEnumerations";
import DebouncedSearchBar from "./DebouncedSearchBar";

export interface FilterBlockProps {
  filters?: CourseFilters;
  onChange: (filters: CourseFilters) => void;
}

const filterOptions = [
  { key: "categories", label: "Categorie", values: courseCategories },
  { key: "levels", label: "Livelli", values: courseLevels },
  { key: "frequencies", label: "Frequenze", values: courseFrequencies },
  {
    key: "availabilities",
    label: "Disponibilità",
    values: courseAvilabilities,
  },
] as const;

export default function FilterBlock({ filters, onChange }: FilterBlockProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Local state for filters
  const [localFilters, setLocalFilters] = useState<CourseFilters>(
    filters || {
      searchText: "",
      advanced: {
        categories: [],
        levels: [],
        frequencies: [],
        availabilities: [],
      },
    }
  );

  // Handle searchText updates from DebouncedSearchBar
  const handleSearchChange = (searchText: string) => {
    const updatedFilters = { ...localFilters, searchText };
    setLocalFilters(updatedFilters);
    onChange(updatedFilters);
  };

  // Handle updates for advanced filters
  const handleAdvancedFilterChange = (
    key: keyof CourseFilters["advanced"],
    value: string[]
  ) => {
    const updatedAdvanced = { ...localFilters.advanced, [key]: value };
    const updatedFilters = { ...localFilters, advanced: updatedAdvanced };
    setLocalFilters(updatedFilters);
    onChange(updatedFilters);
  };

  // Clear filters
  const clearFilter = (
    key: keyof CourseFilters["advanced"],
    valueToRemove?: string
  ) => {
    const updatedValues = valueToRemove
      ? localFilters.advanced[key].filter((v) => v !== valueToRemove)
      : [];
    handleAdvancedFilterChange(key, updatedValues);
  };

  return (
    <Container maxWidth="xl" sx={{ p: 5 }}>
      {/* Search Bar */}
      <Stack gap={3} direction="row" mb={2} width="100%">
        <DebouncedSearchBar
          value={localFilters.searchText}
          onChange={handleSearchChange}
        />
        <Button
          variant="contained"
          onClick={() => setShowAdvanced((prev) => !prev)}
          sx={{ whiteSpace: "nowrap" }}
        >
          {showAdvanced ? <ArrowUpward /> : <FilterList />}
          <Typography component="span" sx={{ px: 2 }}>
            Filtri
          </Typography>
        </Button>
      </Stack>

      {/* Active Filters */}
      <Box display="flex" gap={1} mb={2} flexWrap="wrap">
        {filterOptions.map(({ key, label, values }) => {
          const selectedValues = localFilters.advanced[key];
          return selectedValues.map((value) => {
            const valueLabel =
              values.find((v) => v.value === value)?.label || value;

            return (
              <Chip
                key={`${key}-${value}`}
                label={`${label}: ${valueLabel}`}
                onDelete={() => clearFilter(key, value)}
              />
            );
          });
        })}
      </Box>

      {/* Advanced Filters */}
      <Collapse in={showAdvanced}>
        <Paper sx={{ p: 3 }}>
          <Box display="flex" gap={2} flexWrap="wrap">
            {filterOptions.map(({ key, label, values }) => (
              <FormControl
                sx={{ minWidth: 250 }}
                size="small"
                key={`filter-${key}`}
              >
                <InputLabel>{label}</InputLabel>
                <CheckboxSelector
                  values={localFilters.advanced[key]}
                  label={label}
                  allValues={values}
                  maxWidth={230}
                  onChange={(value) => handleAdvancedFilterChange(key, value)}
                />
              </FormControl>
            ))}
          </Box>
        </Paper>
      </Collapse>
    </Container>
  );
}
