import { z } from "zod";

const templateSchema = z.object({
  templateName: z
    .string()
    .nonempty("Template name is required")
    .min(3, "At least 3 characters long")
    .max(50, "At most 50 characters long")
    .regex(
      /^[a-zA-Z0-9 _-]+$/,
      "Only letters, numbers, spaces, underscores, and dashes are allowed"
    ),

  medicalNotes: z
    .array(
      z.object({
        title: z
          .string()
          .nonempty("Note title is required")
          .max(100, "Title must be at most 100 characters"),
        description: z.string().nonempty("Note description is required"),
      })
    )
    .min(1, "At least one medical note is required"),
});

export default templateSchema;
