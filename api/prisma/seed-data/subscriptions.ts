import { Subscription } from "@prisma/client";

export const getSubscriptions = (): Subscription[] => {
  return [
    {
      course_id: "18f39116-bff7-424a-8687-8b3bba2ee4db",
      patient_id: "64d007c8-1853-4a1f-8c1c-993719ab857f",

      isPending: false,
      subscriptionRequestMessage: "",
      updated_at: new Date(),
      created_at: new Date(),
    },
    {
      course_id: "2025f71d-14cc-4ab1-b11e-1f9dd56dc034",
      patient_id: "64d007c8-1853-4a1f-8c1c-993719ab857f",
      isPending: true,
      subscriptionRequestMessage: "",
      updated_at: new Date(),
      created_at: new Date(),
    },
    {
      course_id: "18f39116-bff7-424a-8687-8b3bba2ee4db",
      patient_id: "24d007c8-1853-4a1f-8c1c-993719ab857f",
      isPending: false,
      subscriptionRequestMessage: "",
      updated_at: new Date(),
      created_at: new Date(),
    },
    {
      course_id: "2025f71d-14cc-4ab1-b11e-1f9dd56dc034",
      patient_id: "24d007c8-1853-4a1f-8c1c-993719ab857f",

      isPending: true,
      subscriptionRequestMessage: "",
      updated_at: new Date(),
      created_at: new Date(),
    },
  ];
};
