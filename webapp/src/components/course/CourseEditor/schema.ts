import { CreateCourseDto } from "@easymotion/openapi";
import { DateTime } from "luxon";
import { z } from "zod";

export type CourseFormData = CreateCourseDto & { id?: string };

export const courseSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "Il titolo è obbligatorio"),
    short_description: z.string().min(1, "La descrizione breve è obbligatoria"),
    description: z.string().min(1, "La descrizione è obbligatoria"),
    location: z
      .string()
      .min(3, "Inserire una località valida")
      .nullable()
      .optional(),
    category_id: z.string().min(1, "La categoria è obbligatoria"),
    level: z.enum(["BASIC", "MEDIUM", "ADVANCED"]),
    instructors: z
      .array(z.string().min(1, "Inserire un istruttore valido"))
      .min(1, "Almeno un istruttore è obbligatorio"),
    price: z.number().nullable().optional(),
    is_free: z.boolean(),
    number_of_payments: z.number().nullable().optional(),
    max_subscribers: z.number().nullable().optional(),
    tags: z.array(z.string()),
    is_published: z.boolean(),
    subscriptions_open: z.boolean(),
    sessions: z
      .array(
        z.object({
          id: z.string().optional().nullable(),
          start_time: z.string().datetime({
            message: "L'orario di inizio è obbligatorio",
            offset: true,
          }),
          end_time: z.string().datetime({
            message: "L'orario di fine è obbligatorio",
            offset: true,
          }),
        })
      )
      .min(1, "Almeno una sessione è obbligatoria"),
    subscription_start_date: z.string().datetime({
      message: "L'orario di inizio iscrizioni è obbligatorio",
      offset: true,
    }),
    subscription_end_date: z.string().datetime({
      message: "L'orario di fine iscrizioni è obbligatorio",
      offset: true,
    }),
  })
  .superRefine((data, ctx) => {
    // FIXME: si applica solo dopo aver premuto il tasto Invia
    if (!data.is_free) {
      if (data.price === null || data.price === undefined || data.price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Il prezzo deve essere maggiore di 0 se il corso non è gratuito",
          path: ["price"],
        });
      }
    }

    if (
      DateTime.fromISO(data.subscription_end_date).diff(
        DateTime.fromISO(data.subscription_start_date)
      ).milliseconds <= 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "La data di inizio iscrizioni deve essere antecedente alla data di fine iscrizioni",
        path: ["subscription_start_date"],
      });
    }

    for (const session of data.sessions) {
      if (
        DateTime.fromISO(session.start_time).diff(
          DateTime.fromISO(data.subscription_end_date)
        ).milliseconds <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "La data di fine iscrizioni deve essere antecedente alla data di inizio della prima sessione",
          path: ["subscription_end_date"],
        });
      }
    }
  }) satisfies z.ZodType<CourseFormData>;

export const defaultCourse: CourseFormData = {
  id: undefined,
  name: "",
  short_description: "",
  description: "",
  location: "",
  category_id: "",
  level: "BASIC" as const,
  instructors: [],
  is_free: true,
  price: null,
  number_of_payments: null,
  max_subscribers: null,
  tags: [],
  is_published: false,
  subscriptions_open: false,
  sessions: [],
  subscription_start_date: DateTime.now().toISO(),
  subscription_end_date: DateTime.now().toISO(),
};
