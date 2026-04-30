import z from "zod";

export const createProfileSchema = z.object({
  displayName: z.string().optional(),
  birthDate: z.coerce
    .number()
    .int()
    .max(2_147_483_647, { message: "Invalid birth date" })
    .optional(),
  profession: z.string().optional(),
  avatarUrl: z.string().optional(),
  avatarPublicId: z.string().optional(),
  timezone: z.string({ message: "timezone is required" }),
});

export const updateProfileSchema = createProfileSchema.partial();

export type CreateProfileDTO = z.infer<typeof createProfileSchema>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
