import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  profile_image: z.string().url("Invalid image URL").or(z.any()).optional(),
  location: z
    .object({
      type: z.string().min(1, "Location type is required"),
      coordinates: z
        .array(z.number())
        .min(2, "At least two coordinates are required"),
    })
    .optional(),
  email: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  rating: z.string().optional(),
  orders: z.string().optional(),
  deviceToken: z.array(z.string()).optional(),
  // ✅ Made optional
  wallet: z.string().optional(),
  role: z.string().optional(),
  user_id: z.string().optional(),
  _id: z.string().optional(),
  lat: z.coerce.number().optional(), // ✅ Accepts 12.213 or "12.213"
  lng: z.coerce.number().optional(), // ✅ Accepts 12.213 or "12.213"
});

export type UserFormValues = z.infer<typeof userSchema>;
