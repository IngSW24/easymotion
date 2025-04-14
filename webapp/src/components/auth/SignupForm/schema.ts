import { SignUpDto } from "@easymotion/openapi";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "La password deve contenere almeno 6 caratteri.")
  .regex(
    /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/,
    "La password deve contenere almeno una lettera e un numero."
  );

export const signupCredentialsSchema = z
  .object({
    email: z.string().email("Email non valida."),
    password: passwordSchema,
    repeatedPassword: passwordSchema,
    termsAndConditions: z
      .boolean()
      .refine(
        (val) => val === true,
        "Devi accettare i termini e le condizioni."
      ),
  })
  .refine((data) => data.password === data.repeatedPassword, {
    message: "Le password non coincidono.",
    path: ["repeatedPassword"],
  }) satisfies z.ZodType<
  Pick<SignUpDto, "email" | "password" | "repeatedPassword"> & {
    termsAndConditions: boolean;
  }
>;

export type SignupCredentials = z.infer<typeof signupCredentialsSchema>;

export const signupInformationSchema = z.object({
  firstName: z.string().nonempty("Il nome è obbligatorio."),
  middleName: z.string().optional(),
  lastName: z.string().nonempty("Il cognome è obbligatorio."),
  birthDate: z.string().nonempty("La data di nascita è obbligatoria."),
  phoneNumber: z.string().nonempty("Il numero di telefono è obbligatorio."),
}) satisfies z.ZodType<
  Pick<
    SignUpDto,
    "firstName" | "middleName" | "lastName" | "birthDate" | "phoneNumber"
  >
>;

export type SignupInformation = z.infer<typeof signupInformationSchema>;
