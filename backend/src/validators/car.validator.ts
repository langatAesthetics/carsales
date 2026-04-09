import { z } from "zod";

export const createCarSchema = z.object({
  title: z.string().min(1, "Title is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().positive("Price must be greater than 0"),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
});