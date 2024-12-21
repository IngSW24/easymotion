/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateCourseDto {
  /** Name of the course */
  name: string;
  /** Full description of the course */
  description: string;
  /** Short description of the course */
  short_description: string;
  /** Location where the course is held (optional) */
  location?: string;
  /** Schedule of course session days */
  schedule: string[];
  /** Array of user IDs of instructors */
  instructors: string[];
  /** Category of the course */
  category:
    | "ACQUAGYM"
    | "CROSSFIT"
    | "PILATES"
    | "ZUMBA_FITNESS"
    | "POSTURAL_TRAINING"
    | "BODYWEIGHT_WORKOUT";
  /** Level of the course */
  level: "BASIC" | "MEDIUM" | "ADVANCED";
  /** Frequency of the course */
  frequency: "SINGLE_SESSION" | "WEEKLY" | "MONTHLY";
  /** Duration of each session in POSIX format */
  session_duration: string;
  /**
   * Cost of the course (optional)
   * @min 1
   */
  cost?: number;
  /**
   * Discount for the course (optional)
   * @min 1
   */
  discount?: number;
  /** Availability status of the course */
  availability: "ACTIVE" | "COMING_SOON" | "NO_LONGER_AVAILABLE";
  /**
   * Priority level for highlighting the course (optional)
   * @min 1
   */
  highlighted_priority?: number;
  /**
   * Maximum capacity of course members (optional)
   * @min 1
   */
  members_capacity?: number;
  /**
   * Number of registered members
   * @min 1
   * @default 0
   */
  num_registered_members: number;
  /** Tags associated with the course */
  tags: string[];
  /** Path to the thumbnail image for the course (optional) */
  thumbnail_path?: string;
}

export interface CourseEntity {
  /** Unique identifier for the course */
  id: string;
  /** Name of the course */
  name: string;
  /** Full description of the course */
  description: string;
  /** Short description of the course */
  short_description: string;
  /** Location where the course is held (optional) */
  location?: string;
  /** Schedule of course session days */
  schedule: string[];
  /** Array of user IDs of instructors */
  instructors: string[];
  /** Category of the course */
  category:
    | "ACQUAGYM"
    | "CROSSFIT"
    | "PILATES"
    | "ZUMBA_FITNESS"
    | "POSTURAL_TRAINING"
    | "BODYWEIGHT_WORKOUT";
  /** Level of the course */
  level: "BASIC" | "MEDIUM" | "ADVANCED";
  /** Frequency of the course */
  frequency: "SINGLE_SESSION" | "WEEKLY" | "MONTHLY";
  /** Duration of each session in POSIX format */
  session_duration: string;
  /**
   * Cost of the course (optional)
   * @min 1
   */
  cost?: number;
  /**
   * Discount for the course (optional)
   * @min 1
   */
  discount?: number;
  /** Availability status of the course */
  availability: "ACTIVE" | "COMING_SOON" | "NO_LONGER_AVAILABLE";
  /**
   * Priority level for highlighting the course (optional)
   * @min 1
   */
  highlighted_priority?: number;
  /**
   * Maximum capacity of course members (optional)
   * @min 1
   */
  members_capacity?: number;
  /**
   * Number of registered members
   * @min 1
   * @default 0
   */
  num_registered_members: number;
  /** Tags associated with the course */
  tags: string[];
  /** Path to the thumbnail image for the course (optional) */
  thumbnail_path?: string;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface UpdateCoursesDto {
  /** Name of the course */
  name?: string;
  /** Full description of the course */
  description?: string;
  /** Short description of the course */
  short_description?: string;
  /** Location where the course is held (optional) */
  location?: string;
  /** Schedule of course session days */
  schedule?: string[];
  /** Array of user IDs of instructors */
  instructors?: string[];
  /** Category of the course */
  category?:
    | "ACQUAGYM"
    | "CROSSFIT"
    | "PILATES"
    | "ZUMBA_FITNESS"
    | "POSTURAL_TRAINING"
    | "BODYWEIGHT_WORKOUT";
  /** Level of the course */
  level?: "BASIC" | "MEDIUM" | "ADVANCED";
  /** Frequency of the course */
  frequency?: "SINGLE_SESSION" | "WEEKLY" | "MONTHLY";
  /** Duration of each session in POSIX format */
  session_duration?: string;
  /**
   * Cost of the course (optional)
   * @min 1
   */
  cost?: number;
  /**
   * Discount for the course (optional)
   * @min 1
   */
  discount?: number;
  /** Availability status of the course */
  availability?: "ACTIVE" | "COMING_SOON" | "NO_LONGER_AVAILABLE";
  /**
   * Priority level for highlighting the course (optional)
   * @min 1
   */
  highlighted_priority?: number;
  /**
   * Maximum capacity of course members (optional)
   * @min 1
   */
  members_capacity?: number;
  /**
   * Number of registered members
   * @min 1
   * @default 0
   */
  num_registered_members?: number;
  /** Tags associated with the course */
  tags?: string[];
  /** Path to the thumbnail image for the course (optional) */
  thumbnail_path?: string;
}
