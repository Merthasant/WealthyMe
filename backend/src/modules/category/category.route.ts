import accessMiddleware from "@/middlewares/access.middleware";
import express from "express";
import categoryController from "./category.controller";

const router = express.Router();

router.get(
  "/:id",
  accessMiddleware.verifyUser,
  categoryController.getOneCategory,
);
router.get("/", accessMiddleware.verifyUser, categoryController.getAllCategory);
router.post(
  "/",
  accessMiddleware.verifyUser,
  categoryController.createCategory,
);
router.patch(
  "/:id",
  accessMiddleware.verifyUser,
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  accessMiddleware.verifyUser,
  categoryController.deleteCategory,
);

export default router;
