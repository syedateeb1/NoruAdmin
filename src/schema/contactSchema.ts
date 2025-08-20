import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Invalid email address"),
  lat: z.string().min(1, "Lat is required"),
  lng: z.string().min(1, "Lng is required"),
  profile_image: z.any(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
