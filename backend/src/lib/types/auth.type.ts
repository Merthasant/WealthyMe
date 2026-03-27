import { Request } from "express";

export interface AuthOutput {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  updatedAt: Date;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
