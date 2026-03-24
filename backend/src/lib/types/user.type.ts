export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  confPassword: string;
  role: "admin" | "user";
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  confPassword?: string;
  role?: "admin" | "user";
}
