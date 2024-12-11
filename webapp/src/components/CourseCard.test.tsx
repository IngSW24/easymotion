import CourseCard from "./CourseCard";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CourseEntity, CourseType } from "../../client/data-contracts";

describe("CourseCard GUI test", () => {
  const testCourse: CourseEntity = {
    id: "sample_identifier",
    organizer: "sample_organizer",
    description: "sample_description",
    type: CourseType.AUTONOMOUS,
    times: "sample_times",
    frequency: "sample_frequency",
    instructor: "sample_instructor",
    location: "sample_location",
    cost: 235478236,
  };

  it("Check if CourseCard shows the correct information", () => {
    // Render CourseCard
    render(
      <MemoryRouter>
        <CourseCard course={testCourse} onDeleteClick={() => {}} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(`Organizer: ${testCourse.organizer}`)
    ).toBeDefined();
    expect(
      screen.getByText(`Description: ${testCourse.description}`)
    ).toBeDefined();
    expect(screen.getByText(`Type: ${testCourse.type}`)).toBeDefined();
    expect(
      screen.getByText(`Frequency: ${testCourse.frequency}`)
    ).toBeDefined();
    expect(
      screen.getByText(`Instructor: ${testCourse.instructor}`)
    ).toBeDefined();
    expect(screen.getByText(`Location: ${testCourse.location}`)).toBeDefined();
    expect(screen.getByText(`Times: ${testCourse.times}`)).toBeDefined();
    expect(screen.getByText(`Cost: ${testCourse.cost}`)).toBeDefined();
  });
});
