import { z } from "zod";

export const supportTicketSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["Low", "Medium", "High"]),
  attachment: z.any().optional(),
});

export type SupportTicketFormValues = z.infer<typeof supportTicketSchema>;
