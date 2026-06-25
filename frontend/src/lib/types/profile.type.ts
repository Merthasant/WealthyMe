import { z } from "zod";

const int4Max = 2_147_483_647;

export const createInputProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, { message: "Display name must be at least 2 characters long" })
    .max(100, { message: "Display name must be at most 100 characters long" })
    .optional(),
  birthDate: z
    .string()
    .transform((val) => {
      if (!val) return undefined;
      const date = new Date(val);
      const unixTime = Math.floor(date.getTime() / 1000);
      if (unixTime < 0 || unixTime > int4Max) {
        throw new Error(
          "Birth date must be a valid date between 1970 and 2038",
        );
      }
      return unixTime;
    })
    .optional(),
  profession: z.string().optional(),
  avatar: z
    .instanceof(File, { message: "Avatar must be a valid file" })
    .nullable()
    .optional(),
  timezone: z.string({ message: "timezone is required" }),
});

export const updateInputProfileSchema = createInputProfileSchema.partial();

export type CreateInputProfile = z.infer<typeof createInputProfileSchema>;
export type UpdateInputProfile = z.infer<typeof updateInputProfileSchema>;

export type Profile = {
  id: string;
  displayName: string;
  birthDate: number;
  avatarUrl: null | string;
  profession: string;
  timezone: string;
  createdAt: number;
  updatedAt: number;
};
