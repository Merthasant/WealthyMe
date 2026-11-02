import z from "zod";
import { createUserSchema } from "./user.type";
import { roles } from "@/generated/prisma/browser";

export interface AuthOutput {
  id: string;
  name: string;
  email: string;
  role: roles;
  updatedAt: BigInt;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export const loginSchema = z.object({
  email: z.email({ message: "invalid email address!" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters!" }),
});

export const registerSchema = createUserSchema;

export type LoginDTO = z.infer<typeof loginSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
