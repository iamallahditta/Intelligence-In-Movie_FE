import { z } from "zod";

const patientSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .refine((val) => isNaN(Number(val)), {
      message: "First name should not be a number",
    }),

  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .refine((val) => isNaN(Number(val)), {
      message: "Last name should not be a number",
    }),

  dateOfBirth: z
    .string()
    .min(1, { message: "Date of birth is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Please enter a valid date",
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: "Date of birth cannot be in the future",
    }),

  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .refine((val) => !isNaN(Number(val.replace(/[-+()]/g, ""))), {
      message: "Invalid phone number",
    }),

  email: z.string().email({ message: "Invalid email address" }),

  gender: z.enum(["male", "female"], {
    required_error: "Gender is required",
  }),

  patientId: z.string().min(1, { message: "Patient Id is required" }),
});

export default patientSchema;
