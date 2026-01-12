import { z } from "zod";
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
// Define the Signup schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const otpSchema = z.object({
  otp: z
    .array(z.string())
    .transform((otpArray) => otpArray.filter((char) => char !== ""))
    .refine((filteredArray) => filteredArray.length === 6, {
      message: "Otp must have exactly 6 values",
    }),
});

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(passwordRegex, {
        message:
          "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      }),

    confirm_password: z
      .string()
      .min(8, {
        message: "Confirm Password must be at least 8 characters long",
      }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export { forgotPasswordSchema, otpSchema, resetPasswordSchema };
