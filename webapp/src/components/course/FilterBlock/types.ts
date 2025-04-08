import { CourseCategoryDto } from "@easymotion/openapi";

export type CourseFilters = {
  advanced: {
    categories: CourseCategoryDto[];
    levels: string[];
  };
  searchText: string;
};

export type CheckboxFilterDescriptor = {
  key: keyof Omit<CourseFilters, "searchText">;
  label: string;
  values: { label: string; value: string }[];
};
