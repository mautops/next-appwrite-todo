import { z } from "zod";

export const TodoSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title is Required" })
    .max(512, { message: "Title must be at most 512 characters" }),
  content: z
    .string()
    .min(5, { message: "Content is Required" })
    .max(1024, { message: "Content must be at most 1024 characters" }),
  completed: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});
