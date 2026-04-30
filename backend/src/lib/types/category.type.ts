import z from "zod";

export const createCategorySchema = z.object({
  name: z.string({ message: "name is required" }).min(2, {
    message: "name must be at least 2 characters",
  }),
  type: z.enum(["income", "expense"], {
    message: "category type must be either 'income' or 'expense'",
  }),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
