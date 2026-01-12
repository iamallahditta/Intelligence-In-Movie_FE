import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const SignupSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name must be at least 1 character long" })
      .refine((val) => isNaN(Number(val)), {
        message: "Name should not be a number",
      }),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(passwordRegex, {
        message:
          "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      }),
    confirm_password: z.string().min(8, {
      message: "Confirm Password must be at least 8 characters long",
    }),

    currentEMR: z
      .string()
      .max(15, { message: "Current EMR must be 15 characters or less" })
      .optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export default SignupSchema;
