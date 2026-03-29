import express from "express";
import userController from "./user.controller.js";
import accessMiddleware from "@/middlewares/access.middleware.js";

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
  userController.createUser,
);
router.patch(
  "/:id",
  accessMiddleware.verifyUser,
  accessMiddleware.isAdmin,
  userController.updateUser,
);
router.delete(
  "/:id",
  accessMiddleware.verifyUser,
  accessMiddleware.isAdmin,
  userController.deleteUser,
);

export default router;
