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
  CircularProgress,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { ArrowUpward, FilterList } from "@mui/icons-material";
import { useState, useMemo } from "react";
import CheckboxSelector from "../../atoms/Select/CheckboxSelector";
import DebouncedSearchBar from "./DebouncedSearchBar";
import { CourseFilters } from "../../../hooks/useCourses";
import { useCourseCategory } from "../../../hooks/useCourseCategories";

export interface FilterBlockProps {
  filters?: CourseFilters;
  onChange: (filters: CourseFilters) => void;
}

const levelsOptions = [
  { value: "BASIC", label: "Base" },
  { value: "MEDIUM", label: "Intermedio" },
  { value: "ADVANCED", label: "Avanzato" },
];

export default function FilterBlock({ filters, onChange }: FilterBlockProps) {
  const [showFilters, setShowFilters] = useState(false);
  const { getAll: getCategories } = useCourseCategory();

  const categoryOptions = useMemo(() => {
    if (getCategories.isLoading || !getCategories.data) return [];

    return getCategories.data.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  }, [getCategories.data, getCategories.isLoading]);

  const filterOptions = useMemo(
    () => [{ key: "categories", label: "Categorie", values: categoryOptions }],
    [categoryOptions]
  );

  const [localFilters, setLocalFilters] = useState<CourseFilters>(
    filters || {
      searchText: undefined,
      categories: undefined,
      level: undefined,
    }
  );

  const handleChange = (filters: CourseFilters) => {
    onChange({
      searchText: !filters.searchText ? undefined : filters.searchText,
      level: filters.level ?? undefined,
      categories:
        (filters.categories?.length ?? 0) > 0 ? filters.categories : undefined,
    });
  };

  const handleSearchChange = (searchText: string) => {
    const updatedFilters = { ...localFilters, searchText };
    setLocalFilters(updatedFilters);
    handleChange(updatedFilters);
  };

  const handleFilterChange = (
    key: keyof Omit<CourseFilters, "searchText" | "level">,
    value: string[]
  ) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    handleChange(updatedFilters);
  };

  const handleLevelChange = (event: SelectChangeEvent<string>) => {
    const level = event.target.value === "" ? undefined : event.target.value;
    const updatedFilters = { ...localFilters, level };
    setLocalFilters(updatedFilters);
    handleChange(updatedFilters);
  };

  // Clear filters
  const clearFilter = (
    key: keyof Omit<CourseFilters, "searchText">,
    valueToRemove?: string
  ) => {
    if (!localFilters[key]) return;

    if (key === "level") {
      const updatedFilters = { ...localFilters, level: undefined };
      setLocalFilters(updatedFilters);
      handleChange(updatedFilters);
      return;
    }

    const currentValues = localFilters[key] as string[];
    const updatedValues = valueToRemove
      ? currentValues.filter((v) => v !== valueToRemove)
      : [];

    handleFilterChange(
      key as keyof Omit<CourseFilters, "searchText" | "level">,
      updatedValues
    );
  };

  return (
    <Container maxWidth="xl" sx={{ p: { xs: 0, md: 5 } }}>
      {/* Search Bar */}
      <Stack gap={3} direction="row" mb={2} width="100%">
        <DebouncedSearchBar
          value={localFilters.searchText || ""}
          onChange={handleSearchChange}
        />
        <Button
          variant="contained"
          onClick={() => setShowFilters((prev) => !prev)}
          sx={{ whiteSpace: "nowrap" }}
        >
          {showFilters ? <ArrowUpward /> : <FilterList />}
          <Typography component="span" sx={{ px: { xs: 1, md: 2 } }}>
            Filtri
          </Typography>
        </Button>
      </Stack>

      {/* Active Filters */}
      <Box display="flex" gap={1} mb={2} flexWrap="wrap">
        {/* Category Chips */}
        {filterOptions.map(({ key, label, values }) => {
          const selectedValues =
            (localFilters[
              key as keyof Omit<CourseFilters, "searchText">
            ] as string[]) || [];
          return selectedValues.map((value) => {
            const valueLabel =
              values.find((v) => v.value === value)?.label || value;

            return (
              <Chip
                key={`${key}-${value}`}
                label={`${label}: ${valueLabel}`}
                onDelete={() =>
                  clearFilter(
                    key as keyof Omit<CourseFilters, "searchText">,
                    value
                  )
                }
              />
            );
          });
        })}

        {/* Level Chip */}
        {localFilters.level && (
          <Chip
            key="level-chip"
            label={`Livello: ${levelsOptions.find((l) => l.value === localFilters.level)?.label || localFilters.level}`}
            onDelete={() => clearFilter("level")}
          />
        )}
      </Box>

      {/* Filters Panel */}
      <Collapse in={showFilters}>
        <Paper sx={{ p: 3 }}>
          <Box display="flex" gap={2} flexWrap="wrap">
            {getCategories.isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <>
                {/* Categories (multi-select) */}
                {filterOptions.map(({ key, label, values }) => (
                  <FormControl
                    sx={{ minWidth: 250 }}
                    size="small"
                    key={`filter-${key}`}
                  >
                    <InputLabel>{label}</InputLabel>
                    <CheckboxSelector
                      values={
                        (localFilters[
                          key as keyof Omit<CourseFilters, "searchText">
                        ] as string[]) || []
                      }
                      label={label}
                      allValues={values}
                      maxWidth={230}
                      onChange={(value) =>
                        handleFilterChange(
                          key as keyof Omit<
                            CourseFilters,
                            "searchText" | "level"
                          >,
                          value
                        )
                      }
                    />
                  </FormControl>
                ))}

                {/* Level (single-select) */}
                <FormControl sx={{ minWidth: 250 }} size="small">
                  <InputLabel>Livello</InputLabel>
                  <Select
                    value={localFilters.level || ""}
                    label="Livello"
                    onChange={handleLevelChange}
                  >
                    <MenuItem value="">
                      <em>Nessuno</em>
                    </MenuItem>
                    {levelsOptions.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </Box>
        </Paper>
      </Collapse>
    </Container>
  );
}
