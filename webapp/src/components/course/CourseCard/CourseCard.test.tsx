import CourseCard from "./CourseCard";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CourseDto } from "@easymotion/openapi";
import { courseLevels } from "../../../data/course-levels";

const getLabel = (value: string, options: LiteralUnionDescriptor<string>) =>
  options.find((o) => o.value === value)?.label ?? value;

describe("CourseCard GUI test", () => {
  const testCourse: CourseDto = {
    id: "sample_identifier",
    description: "sample_description",
    location: "sample_location",
    price: 235478236,
    name: "sample_name",
    short_description: "sample_short_description",
    instructors: [],
    category: { id: "category id", name: "ACQUAGYM" },
    level: "BASIC",
    tags: ["sample_tag1", "sample_tag2"],
    created_at: "",
    updated_at: "",
    owner: { id: "", email: "", firstName: "", lastName: "", middleName: "" },
    is_free: false,
    is_published: false,
    subscriptions_open: false,
    sessions: [],
  };

  it("Check if CourseCard shows the correct information", () => {
    // Render CourseCard
    render(
      <MemoryRouter>
        <CourseCard course={testCourse} />
      </MemoryRouter>
    );

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
