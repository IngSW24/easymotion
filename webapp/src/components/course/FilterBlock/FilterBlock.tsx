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
import CheckboxSelector from "../../atoms/Select/CheckboxSelector";
import { CourseFilters } from "./types";
import DebouncedSearchBar from "./DebouncedSearchBar";
import { courseLevels } from "../../../data/course-levels";

export interface FilterBlockProps {
  filters?: CourseFilters;
  onChange: (filters: CourseFilters) => void;
}

const filterOptions = [
  {
    key: "categories",
    label: "Categorie",
    values: [
      { value: "BASIC", label: "Base" },
      { value: "MEDIUM", label: "Intermedio" },
      { value: "ADVANCED", label: "Avanzato" },
    ],
  },
  { key: "levels", label: "Livelli", values: courseLevels },
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
      ? localFilters.advanced[key].filter((v) =>
          typeof v === "string" ? v !== valueToRemove : v.id !== valueToRemove
        )
      : [];
    handleAdvancedFilterChange(key, updatedValues as string[]);
  };

  return (
    <Container maxWidth="xl" sx={{ p: { xs: 0, md: 5 } }}>
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
          <Typography component="span" sx={{ px: { xs: 1, md: 2 } }}>
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
                key={`${key}-${typeof value === "string" ? value : value.id}`}
                label={`${label}: ${valueLabel}`}
                onDelete={() =>
                  clearFilter(key, typeof value === "string" ? value : value.id)
                }
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
                  values={localFilters.advanced[key] as string[]}
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
