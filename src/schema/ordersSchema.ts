// src/schema/orderSchema.ts
import { z } from "zod";

export const orderSchema = z.object({
  pickupLocation: z.object({
    type: z.literal("Point"),
    coordinates: z.array(z.number()).length(2), // [longitude, latitude] as per GeoJSON
  }),
  dropOffLocation: z.object({
    type: z.literal("Point"),
    coordinates: z.array(z.number()).length(2), // [longitude, latitude]
  }),
  status: z.enum(["pending", "in-progress", "delivered"]), // Restrict to valid statuses
  title: z.string().min(1, "Title is required"), // User ID or reference
  order_by: z.any(), // User ID or reference
  category: z.string().min(1, "Category is required"), // Category ID or reference
  pickup_location: z.string().min(1, "Pickup location is required"), // Human-readable location
  dropoff_location: z.string().min(1, "Dropoff location is required"), // Human-readable location
  pickup_datetime: z.string().datetime(), // ISO date string (e.g., "2025-05-11T00:00:00Z")
  dropoff_datetime: z.string().datetime(), // ISO date string
  weight: z.number().min(0, "Weight must be positive"), // Convert string input to number
  invoice: z.string().min(1, "Invoice number is required"), // Convert string input to number
  image: z.any().optional(), // Optional file upload
});

export type OrderFormValues = z.infer<typeof orderSchema>;
