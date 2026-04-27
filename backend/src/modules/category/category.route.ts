import accessMiddleware from "@/middlewares/access.middleware";
import express from "express";
import categoryController from "./category.controller";
import validationMiddleware from "@/middlewares/validation.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/lib/types/category.type";
import { categoryOptionSchema } from "@/lib/types/params.type";

const router = express.Router();

router.get(
  "/:id",
  accessMiddleware.verifyUser,
  categoryController.getOneCategory,
);
router.get(
  "/",
  accessMiddleware.verifyUser,
  validationMiddleware.validateQuery(categoryOptionSchema),
  categoryController.getAllCategory,
);
router.post(
  "/",
  accessMiddleware.verifyUser,
  validationMiddleware.validateBody(createCategorySchema),
  categoryController.createCategory,
);
router.patch(
  "/:id",
  accessMiddleware.verifyUser,
  validationMiddleware.validateBody(updateCategorySchema),
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  accessMiddleware.verifyUser,
  categoryController.deleteCategory,
);

export default router;
