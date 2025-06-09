import { PatientDto, UpdateAuthUserDto } from "@easymotion/openapi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const schema = z.object({
  sex: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().optional(),
  height: z
    .number({ invalid_type_error: "Inserisci l'altezza" })
    .min(50)
    .max(300)
    .nullable()
    .optional(),
  weight: z
    .number({ invalid_type_error: "Inserisci il peso" })
    .min(20)
    .max(500)
    .nullable()
    .optional(),
  profession: z.string().min(2, "Almeno 2 caratteri").nullable().optional(),
  sport: z.string().nullable().optional(),
  sportFrequency: z.number().min(0).max(7).nullable().optional(),
  bloodPressure: z
    .string()
    .regex(/^[0-9]{2,3}\/[0-9]{2,3}$/i, { message: "Formato 120/80" })
    .nullable()
    .optional(),
  restingHeartRate: z.number().positive().nullable().optional(),
  smoker: z.boolean().nullable().optional(),
  alcoholUnits: z.number().min(0).nullable().optional(),
  activityLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable().optional(),
  mobilityLevel: z.enum(["LIMITED", "MODERATE", "FULL"]).nullable().optional(),
  sleepHours: z.number().min(0).max(24).nullable().optional(),
  medications: z.string().nullable().optional(),
  allergies: z.string().nullable().optional(),
  otherPathologies: z.string().nullable().optional(),
  lastMedicalCheckup: z.string().nullable().optional(),
  personalGoals: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
}) satisfies z.ZodType<Omit<PatientDto, "userId">>;

export type PatientFormData = z.infer<typeof schema>;

export const defaultData = {
  sex: null,
  height: null,
  weight: null,
  profession: "",
  sport: "",
  sportFrequency: null,
  bloodPressure: "",
  restingHeartRate: null,
  smoker: false,
  alcoholUnits: null,
  activityLevel: null,
  mobilityLevel: null,
  sleepHours: null,
  medications: "",
  allergies: "",
  otherPathologies: "",
  lastMedicalCheckup: "",
  personalGoals: "",
  notes: "",
};

export interface UsePatientFormProps {
  patient: PatientDto | null;
  onSave: (data: UpdateAuthUserDto) => void;
}

export const usePatientForm = (props: UsePatientFormProps) => {
  const useFormProps = useForm<PatientFormData>({
    resolver: zodResolver(schema),
    values: props.patient ?? defaultData,
  });

  const { reset } = useFormProps;
  useEffect(() => {
    console.log("RESET");
    reset({ ...props.patient }, { keepDirty: false });
  }, [props.patient, reset]);

  const onSubmitEvent = (data: PatientFormData) => {
    props.onSave({ patient: data });
    useFormProps.reset(data);
  };

  return { ...useFormProps, onSubmitEvent };
};
