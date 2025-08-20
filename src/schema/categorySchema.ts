import { z } from "zod";

export const categorySchema = z.object({
  title: z.string().min(1, "Name is required"),
  price_perkg: z.string().min(1, "Price per kg is required"),
  image: z.any(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
 