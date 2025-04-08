import { Prisma } from "@prisma/client";

export const getCategories = (): Prisma.CourseCategoryCreateInput[] => {
  return [
    {
      id: "c1a9c8e0-5c9d-4b39-8f3c-1c5a4d5e6f7g",
      name: "Acquagym",
    },
    {
      id: "c2b8c7e0-6c8d-5b38-7f2c-2c4a5d6e7f8g",
      name: "Crossfit",
    },
    {
      id: "c3b7c6e0-7c7d-6b37-6f1c-3c3a6d7e8f9g",
      name: "Pilates",
    },
    {
      id: "c4b6c5e0-8c6d-7b36-5f0c-4c2a7d8e9f0g",
      name: "Yoga",
    },
    {
      id: "c5b5c4e0-9c5d-8b35-4f9c-5c1a8d9e0f1g",
      name: "Training Posturale",
    },
    {
      id: "c6b4c3e0-0c4d-9b34-3f8c-6c0a9d0e1f2g",
      name: "Zumba Fitness",
    },
  ];
};
