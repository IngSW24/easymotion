import EventCard from "./EventCard";
import { EventEntity } from "../data/event";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

describe("EventCard GUI test", () => {
  const testEvent: EventEntity = {
    id: "sample_identifier",
    organizer: "sample_organizer",
    description: "sample_description",
    type: "sample_type",
    times: "sample_times",
    frequency: "sample_frequency",
    instructor: "sample_instructor",
    location: "sample_location",
    cost: 235478236,
  };

  it("Check if EventCard shows the correct information", () => {
    // Render EventCard
    render(
      <MemoryRouter>
        <EventCard event={testEvent} onDeleteClick={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText(`Organizer: ${testEvent.organizer}`)).toBeDefined();
    expect(screen.getByText(`Description: ${testEvent.description}`)).toBeDefined();
    expect(screen.getByText(`Type: ${testEvent.type}`)).toBeDefined();
    expect(screen.getByText(`Frequency: ${testEvent.frequency}`)).toBeDefined();
    expect(screen.getByText(`Instructor: ${testEvent.instructor}`)).toBeDefined();
    expect(screen.getByText(`Location: ${testEvent.location}`)).toBeDefined();
    expect(screen.getByText(`Times: ${testEvent.times}`)).toBeDefined();
    expect(screen.getByText(`Cost: ${testEvent.cost}`)).toBeDefined();
  });
});
