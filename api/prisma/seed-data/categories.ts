import { Prisma } from "@prisma/client";

export const getCategories = (): Prisma.CourseCategoryCreateInput[] => {
  return [
    {
      id: "6a642a92-b256-43d3-8667-804962aad85f",
      name: "Acquagym",
    },
    {
      id: "90a8d0a9-a184-4809-b75e-95a1e3e5ed40",
      name: "Crossfit",
    },
    {
      id: "f4ba1b5b-b531-4c6b-8d1f-796cae26ebd2",
      name: "Pilates",
    },
    {
      id: "ec0ac108-c9e0-425f-a55e-a794aeb33094",
      name: "Yoga",
    },
    {
      id: "00780769-3cb8-4bfa-8f86-abe83124c154",
      name: "Training Posturale",
    },
    {
      id: "e58cba6d-56f4-4d14-a9ca-05019fa544da",
      name: "Zumba Fitness",
    },
  ];
};
