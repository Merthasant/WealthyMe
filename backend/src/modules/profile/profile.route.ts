import accessMiddleware from "@/middlewares/access.middleware";
import express from "express";
import profileController from "./profile.controller";
import { upload } from "@/middlewares/multer.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import {
  createProfileSchema,
  updateProfileSchema,
} from "@/lib/types/profile.type";

const router = express.Router();

router.get("/", accessMiddleware.verifyUser, profileController.getProfile);
router.post(
  "/",
  accessMiddleware.verifyUser,
  upload.single("avatar"),
  validationMiddleware.validateBody(createProfileSchema),
  profileController.createProfile,
);
router.patch(
  "/avatar",
  accessMiddleware.verifyUser,
  profileController.deleteAvatarOnly,
);
router.patch(
  "/",
  accessMiddleware.verifyUser,
  upload.single("avatar"),
  validationMiddleware.validateBody(updateProfileSchema),
  profileController.updateProfile,
);

export default router;
