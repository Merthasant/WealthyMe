import z from "zod";

export const createCategorySchema = z.object({
  name: z.string({ message: "name is required" }).min(2, {
    message: "name must be at least 2 characters",
  }),
  type: z.enum(["income", "expense"], { message: "Invalid category type" }),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
