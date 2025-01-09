import CourseDetail from "./CourseDetail";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CourseEntity } from "../../../../client/data-contracts";
import {
  courseCategories,
  courseLevels,
} from "../../../data/courseEnumerations";

async function onCourseDetailSave(course: CourseEntity): Promise<CourseEntity> {
  return Promise.resolve(course);
}

const getLabel = (value: string, options: LiteralUnionDescriptor<string>) =>
  options.find((o) => o.value === value)?.label ?? value;

describe("CourseDetail GUI test", () => {
  const testCourse: CourseEntity = {
    id: "sample_identifier",
    description: "sample_description",
    location: "sample_location",
    cost: 235478236,
    name: "sample_name",
    short_description: "sample_short_description",
    schedule: [
      "sample_schedule1",
      "sample_schedule2",
      "sample_schedule3",
      "sample_schedule4",
    ],
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
  };

  it("Check if CourseDetail shows the correct information", () => {
    // Render CourseCard
    render(
      <MemoryRouter>
        <CourseDetail
          course={testCourse}
          canEdit={false}
          onSave={onCourseDetailSave}
        />
      </MemoryRouter>
    );

    //expect(screen.getByText(testCourse.name)).toBeDefined();
    expect(
      screen.getByText(getLabel(testCourse.level, courseLevels))
    ).toBeDefined();
    expect(screen.getByText(testCourse.short_description)).toBeDefined();
    expect(screen.getByText(testCourse.description)).toBeDefined();
    expect(
      screen.getByText(getLabel(testCourse.category, courseCategories))
    ).toBeDefined();
    testCourse.schedule.map((schedule) => {
      expect(screen.getByText(schedule)).toBeDefined();
    });
    testCourse.schedule.map((tag) => {
      expect(screen.getByText(tag)).toBeDefined();
    });
  });
});
