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
    imagePath: "sample_imagePath",
    shortDescription: "sample_shortDescription",
    sessions: [
      {
        id: "session1",
        startTime: DateTime.now().toISO(),
        endTime: DateTime.now().toISO(),
      },
    ],
    instructors: [],
    category: {
      id: "categoryid",
      name: "The category",
    },
    level: "BASIC",
    tags: ["sample_tag1", "sample_tag2"],
    createdAt: "",
    updatedAt: "",
    owner: {
      id: "",
      email: "",
      firstName: "",
      lastName: "",
      middleName: "",
    },
    isPublished: false,
    subscriptionsOpen: false,
    subscriptionStartDate: "",
    subscriptionEndDate: "",
    paymentRecurrence: "SINGLE",
    currentSubscribers: 0,
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
    expect(screen.getByText(testCourse.shortDescription)).toBeDefined();
    expect(screen.getByText(testCourse.description)).toBeDefined();
    /*     expect(
      screen.getByText(getLabel(testCourse.category.name, courseCategories))
    ).toBeDefined(); */
    testCourse.tags.map((t) => {
      expect(screen.getByText(t)).toBeDefined();
    });
  });
});
