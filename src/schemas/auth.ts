import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Message is Required" }),
  password: z.string().min(1, { message: "Password is Required" }),
});

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(1, { message: "Name is Required" }),
  email: z.string().email({ message: "Message is Required" }),
  mobile: z
    .string()
    .min(1, { message: "Mobile is Required" })
    .max(13, { message: "Mobile must be at most 13 characters" })
    .regex(/^1[3-9]\d{9}$/, {
      message: "Mobile must be a valid Chinese phone number",
    }),
  password: z.string().min(1, { message: "Password is Required" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Confirm Password is Required" }),
});
