import { CourseDto } from "@easymotion/openapi";
import { CourseSession } from "./SessionBuilder/types";

export type EditCourse = {
  title: string;
  shortDescription: string;
  description: string;
  location?: string | null;
  instructorName: string;
  categoryId: string | undefined;
  level: CourseDto["level"];
  sessions: CourseSession[];
  tags: string[];
  isFree: boolean;
  price?: number | null;
  numPayments?: number | null;
  isPublished: boolean;
  subscriptionsOpen: boolean;
  maxSubscribers: number | null | undefined;
};
