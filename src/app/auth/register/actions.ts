"use server";

import { RegisterSchema } from "@/schemas/auth";
import { z } from "zod";

export const EmailRegister = async (data: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(data);

  if (!validatedFields.success) {
    return { message: "Register failed" };
  }

  // const { name, email, password, mobile, confirmPassword } =
  //   validatedFields.data;
  return { message: "Register successful" };
};
