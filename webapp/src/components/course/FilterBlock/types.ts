export type CourseFilters = {
  advanced: {
    categories: string[];
    levels: string[];
    frequencies: string[];
    availabilities: string[];
  };
  searchText: string;
};

export type CheckboxFilterDescriptor = {
  key: keyof Omit<CourseFilters, "searchText">;
  label: string;
  values: { label: string; value: string }[];
};
