import CourseCard from "./CourseCard";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CourseEntity } from "../../../../client/data-contracts";

describe("CourseCard GUI test", () => {
  const testCourse: CourseEntity = {
    id: "sample_identifier",
    description: "sample_description",
    location: "sample_location",
    cost: 235478236,
    name: "sample_name",
    short_description: "sample_short_description",
    schedule: [],
    instructor: [],
    category: "ACQUAGYM",
    level: "BASIC",
    frequency: "SINGLE_SESSION",
    session_duration: "",
    availability: "ACTIVE",
    num_registered_members: 0,
    tags: [],
    created_at: "",
    updated_at: "",
  };

  it("Check if CourseCard shows the correct information", () => {
    // Render CourseCard
    render(
      <MemoryRouter>
        <CourseCard course={testCourse} onDelete={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText(testCourse.short_description)).toBeDefined();
    expect(screen.getByText(testCourse.frequency)).toBeDefined();
    expect(screen.getByText(testCourse.instructor[0])).toBeDefined();
    expect(screen.getByText(testCourse.location ?? "")).toBeDefined();
  });
});
