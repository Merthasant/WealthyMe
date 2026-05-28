import z from "zod";
import type { Role } from "./auth.type";

export const createUserInputSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name must be at most 100 characters long" }),
  email: z.email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
  confPassword: z
    .string()
    .min(6, { message: "Confirm Password must be at least 6 characters long" })
    .max(100, {
      message: "Confirm Password must be at most 100 characters long",
    }),
  role: z.enum(["admin", "user"], {
    message: "Role must be either 'admin' or 'user'",
  }),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export type User = {
  id: string;
  name: string;
  email: string;
  role: {
    name: Role;
  };
  createdAt: number;
  updatedAt: number;
};
