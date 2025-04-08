import CourseDetail from "./CourseDetail";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CourseDto } from "@easymotion/openapi";
import { getCourseLevelName } from "../../../data/course-levels";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DateTime } from "luxon";

describe("CourseDetail GUI test", () => {
  const testCourse: CourseDto = {
    id: "sample_identifier",
    description: "sample_description",
    location: "sample_location",
    price: 235478236,
    name: "sample_name",
    short_description: "sample_short_description",
    sessions: [
      {
        id: "session1",
        start_time: DateTime.now().toISO(),
        end_time: DateTime.now().toISO(),
      },
    ],
    instructors: [],
    category: {
      id: "categoryid",
      name: "The category",
    },
    level: "BASIC",
    tags: ["sample_tag1", "sample_tag2"],
    created_at: "",
    updated_at: "",
    owner: { id: "", email: "", firstName: "", lastName: "", middleName: "" },
    is_free: false,
    is_published: false,
    subscriptions_open: false,
  };

  it("Check if CourseDetail shows the correct information", () => {
    // Render CourseCard
    const mockQueryClient = new QueryClient();
    render(
      <MemoryRouter>
        <QueryClientProvider client={mockQueryClient}>
          <CourseDetail course={testCourse} />
        </QueryClientProvider>
      </MemoryRouter>
    );

    //expect(screen.getByText(testCourse.name)).toBeDefined();
    expect(
      screen.getByText(getCourseLevelName(testCourse.level))
    ).toBeDefined();
    expect(screen.getByText(testCourse.short_description)).toBeDefined();
    expect(screen.getByText(testCourse.description)).toBeDefined();
    /*     expect(
      screen.getByText(getLabel(testCourse.category.name, courseCategories))
    ).toBeDefined(); */
    testCourse.tags.map((t) => {
      expect(screen.getByText(t)).toBeDefined();
    });
  });
});
