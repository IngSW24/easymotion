import EventCard from "./EventCard";
import { EventEntity } from "../data/event";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

describe("Label Component", () => {
  const testEvent: EventEntity = {
    id: "ORG",
    organizer: "ORG",
    description: "ORG",
    type: "ORG",
    times: "ORG",
    frequency: "ORG",
    instructor: "INST",
    location: "LOC",
    cost: 12,
  };

  it('renders a label with text "X"', () => {
    // Render del componente
    render(
      <MemoryRouter>
        <EventCard event={testEvent} onDeleteClick={() => {}} />
      </MemoryRouter>
    );

    // Verifica che l'etichetta con il testo "Organizer: [nome]" sia presente
    const labelElement: HTMLElement = screen.getByText(
      `Organizer: ${testEvent.organizer}`
    );
    expect(labelElement).toBeDefined();
  });
});
