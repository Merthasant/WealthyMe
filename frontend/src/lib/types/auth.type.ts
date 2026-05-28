import { z } from "zod";

export type Role = "user" | "admin";

export type AuthResponse = {
  id: string;
  name: string;
  email: string;
  updatedAt: number;
  createdAt: number;
  role: Role;
  token: {
    accessToken: string;
  };
};

export const loginSchema = z.object({
  email: z.email({ message: "invalid email format" }),
  password: z
    .string({ message: "password is required" })
    .min(6, { message: "password must be at least 6 characters" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type AuthMe = {
  id: string;
  name: string;
  email: string;
  updatedAt: number;
  createdAt: number;
  role: Role;
};
