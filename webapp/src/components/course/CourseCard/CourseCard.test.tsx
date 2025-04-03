import CourseCard from "./CourseCard";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CourseEntity } from "@easymotion/openapi";
import {
  courseCategories,
  courseLevels,
} from "../../../data/courseEnumerations";

const getLabel = (value: string, options: LiteralUnionDescriptor<string>) =>
  options.find((o) => o.value === value)?.label ?? value;

describe("CourseCard GUI test", () => {
  const testCourse: CourseEntity = {
    id: "sample_identifier",
    description: "sample_description",
    location: "sample_location",
    cost: 235478236,
    name: "sample_name",
    short_description: "sample_short_description",
    schedule: [],
    instructors: [],
    category: "ACQUAGYM",
    level: "BASIC",
    frequency: "SINGLE_SESSION",
    session_duration: "",
    availability: "ACTIVE",
    num_registered_members: 0,
    tags: ["sample_tag1", "sample_tag2"],
    created_at: "",
    updated_at: "",
    owner: { id: "", email: "", firstName: "", lastName: "", middleName: "" },
  };

  it("Check if CourseCard shows the correct information", () => {
    // Render CourseCard
    render(
      <MemoryRouter>
        <CourseCard course={testCourse} onDelete={() => {}} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(getLabel(testCourse.category, courseCategories))
    ).toBeDefined();
    expect(
      screen.getByText(getLabel(testCourse.level, courseLevels))
    ).toBeDefined();
    expect(screen.getByText(testCourse.name)).toBeDefined();
    expect(screen.getByText(testCourse.short_description)).toBeDefined();
    testCourse.tags.map((tag) => {
      expect(screen.getByText(tag)).toBeDefined();
    });
  });
});
