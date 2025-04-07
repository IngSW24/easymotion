import { DateTime } from "luxon";

export interface SchedulePickerProps {
  value: string[];
  onChange: (schedule: string[]) => void;
}

export type CourseSession = {
  startTime: DateTime;
  endTime: DateTime;
};
