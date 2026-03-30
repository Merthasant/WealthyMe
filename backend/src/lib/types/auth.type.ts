export interface AuthOutput {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  updatedAt: Number;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
