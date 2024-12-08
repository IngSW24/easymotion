import React from 'react';
import EventCard from './EventCard';
import { EventEntity } from '../data/event';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Label Component', () => {
  const testEvent: EventEntity = {
    id: "ORG",
    organizer: "ORG",
    description: "ORG",
    type: "ORG",
    times: "ORG",
    frequency: "ORG",
    instructor: "INST",
    location: "LOC",
    cost: 12
  }
  
  it('renders a label with text "X"', () => {
    // Render del componente
    render(<EventCard event={testEvent} onDeleteClick={() => {}}/>);

    // Verifica che l'etichetta con il testo "X" sia presente
    const labelElement: HTMLElement = screen.getByText(testEvent.organizer);
    expect(labelElement).toBeDefined();
  });
});