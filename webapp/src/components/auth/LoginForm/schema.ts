import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email non valida."),
  password: z.string().min(6, "La password deve contenere almeno 6 caratteri."),
});

export type LoginFormData = z.infer<typeof loginSchema>;
