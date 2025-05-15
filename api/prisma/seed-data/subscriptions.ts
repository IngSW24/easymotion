import { Subscription } from "@prisma/client";

export const getSubscriptions = (): Subscription[] => {
  return [
    {
      courseId: "18f39116-bff7-424a-8687-8b3bba2ee4db",
      patientId: "64d007c8-1853-4a1f-8c1c-993719ab857f",

      isPending: false,
      subscriptionRequestMessage: "",
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    {
      courseId: "2025f71d-14cc-4ab1-b11e-1f9dd56dc034",
      patientId: "64d007c8-1853-4a1f-8c1c-993719ab857f",
      isPending: true,
      subscriptionRequestMessage: "",
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    {
      courseId: "18f39116-bff7-424a-8687-8b3bba2ee4db",
      patientId: "24d007c8-1853-4a1f-8c1c-993719ab857f",
      isPending: false,
      subscriptionRequestMessage: "",
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    {
      courseId: "2025f71d-14cc-4ab1-b11e-1f9dd56dc034",
      patientId: "24d007c8-1853-4a1f-8c1c-993719ab857f",

      isPending: true,
      subscriptionRequestMessage: "",
      updatedAt: new Date(),
      createdAt: new Date(),
    },
  ];
};
