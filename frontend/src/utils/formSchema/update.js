import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const phoneRegex = /^[0-9]{10,15}$/;
// Define the Signup schema
const updateSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" })
    .refine((val) => isNaN(Number(val)), {
      message: "Name should not be a number",
    }),

  email: z.string().email("Invalid email format"),

  password: z
    .string()
    .optional()
    .refine((val) => !val || passwordRegex.test(val), {
      // message:
      //   "Password must be at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      message: "Must be 8+ chars with uppercase, lowercase, number & special",
    }),

  phone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Phone number must be between 10 to 15 digits",
    }),

  currentEMR: z
    .string()
    .max(15, { message: "Current EMR must be 15 characters or less" })
    .optional(),
});

export default updateSchema;
