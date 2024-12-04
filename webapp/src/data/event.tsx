export interface EventEntity {
    id: string,
    organizer: string;
    instructor: string;
    type: string; // TODO: should be limited to EventType (see below)
    times: string,
    description: string;
    location: string;
    frequency: string,
    cost: number;
}

/*

enum EventType {
  AUTONOMOUS
  INDIVIDUAL
  GROUP
}

*/
