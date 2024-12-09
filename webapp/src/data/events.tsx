import { EventEntity } from "./event"

export interface EventsEntity {
    data: EventEntity[]
    meta: {
        currentPage: number,
        items: number,
        hasNextPage: boolean,
        totalItems: number,
        totalPages: number
    }
}