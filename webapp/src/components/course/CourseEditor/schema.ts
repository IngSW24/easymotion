import { CreateCourseDto } from "@easymotion/openapi";
import { DateTime } from "luxon";
import { z } from "zod";

export type CourseFormData = CreateCourseDto & { id?: string };

export const courseSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "Il titolo è obbligatorio"),
    shortDescription: z.string().min(1, "La descrizione breve è obbligatoria"),
    description: z.string().min(1, "La descrizione è obbligatoria"),
    location: z
      .string()
      .min(3, "Inserire una località valida")
      .nullable()
      .optional(),
    categoryId: z.string().min(1, "La categoria è obbligatoria"),
    level: z.enum(["BASIC", "MEDIUM", "ADVANCED"]),
    instructors: z
      .array(z.string().min(1, "Inserire un istruttore valido"))
      .min(1, "Almeno un istruttore è obbligatorio"),
    price: z.number(),
    paymentRecurrence: z.enum(["SINGLE", "MONTHLY", "ANNUAL", "PER_SESSION"]),
    maxSubscribers: z.number().nullable().optional(),
    tags: z.array(z.string()),
    isPublished: z.boolean(),
    subscriptionsOpen: z.boolean(),
    sessions: z
      .array(
        z.object({
          id: z.string().optional().nullable(),
          startTime: z.string().datetime({
            message: "L'orario di inizio è obbligatorio",
            offset: true,
          }),
          endTime: z.string().datetime({
            message: "L'orario di fine è obbligatorio",
            offset: true,
          }),
        })
      )
      .min(1, "Almeno una sessione è obbligatoria"),
    subscriptionStartDate: z.string().datetime({
      message: "L'orario di inizio iscrizioni è obbligatorio",
      offset: true,
    }),
    subscriptionEndDate: z.string().datetime({
      message: "L'orario di fine iscrizioni è obbligatorio",
      offset: true,
    }),
  })
  .superRefine((data, ctx) => {
    if (
      DateTime.fromISO(data.subscriptionEndDate).diff(
        DateTime.fromISO(data.subscriptionStartDate)
      ).milliseconds <= 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "La data di inizio iscrizioni deve essere antecedente alla data di fine iscrizioni",
        path: ["subscriptionStartDate"],
      });
    }

    for (const session of data.sessions) {
      if (
        DateTime.fromISO(session.startTime).diff(
          DateTime.fromISO(data.subscriptionEndDate)
        ).milliseconds <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "La data di fine iscrizioni deve essere antecedente alla data di inizio della prima sessione",
          path: ["subscriptionEndDate"],
        });
      }
    }
  }) satisfies z.ZodType<CourseFormData>;

export const defaultCourse: CourseFormData = {
  id: undefined,
  name: "",
  shortDescription: "",
  description: "",
  location: "",
  categoryId: "",
  level: "BASIC" as const,
  instructors: [],
  price: 0,
  maxSubscribers: null,
  tags: [],
  isPublished: false,
  subscriptionsOpen: false,
  sessions: [],
  subscriptionStartDate: DateTime.now().toISO(),
  subscriptionEndDate: DateTime.now().toISO(),
  paymentRecurrence: "SINGLE",
};
