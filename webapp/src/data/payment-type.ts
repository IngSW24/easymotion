import { CourseDto } from "@easymotion/openapi";

export const paymentRecurrence: LiteralUnionDescriptor<
  CourseDto["payment_recurrence"]
> = [
  { value: "SINGLE", label: "unica rata" },
  { value: "PER_SESSION", label: "a sessione" },
  { value: "MONTHLY", label: "mensile" },
  { value: "ANNUAL", label: "annuale" },
];

export const getPaymentRecurrenceName = (value: string) =>
  paymentRecurrence.find((o) => o.value === value)?.label ?? value;
