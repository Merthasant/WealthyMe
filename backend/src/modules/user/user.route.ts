import express from "express";
import userController from "./user.controller.js";
import accessMiddleware from "@/middlewares/access.middleware.js";
import validationMiddleware from "@/middlewares/validation.middleware.js";
import { createUserSchema, updateUserSchema } from "@/lib/types/user.type.js";
import { baseOptionSchema } from "@/lib/types/params.type.js";

const router = express.Router();

router.get(
  "/",
  accessMiddleware.verifyUser,
  accessMiddleware.isAdmin,
  userController.getAllUser,
);
router.get(
  "/:id",
  accessMiddleware.verifyUser,
  accessMiddleware.isAdmin,
  userController.getOneUser,
);
router.post(
  "/",
  accessMiddleware.verifyUser,
  accessMiddleware.isAdmin,
  validationMiddleware.validateQuery(baseOptionSchema),
  validationMiddleware.validateBody(createUserSchema),
  userController.createUser,
);
router.patch(
  "/:id",
  accessMiddleware.verifyUser,
  accessMiddleware.isAdmin,
  validationMiddleware.validateBody(updateUserSchema),
  userController.updateUser,
);
router.delete(
  "/:id",
  accessMiddleware.verifyUser,
  accessMiddleware.isAdmin,
  userController.deleteUser,
);

export default router;
