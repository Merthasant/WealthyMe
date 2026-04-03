import accessMiddleware from "@/middlewares/access.middleware";
import express from "express";
import profileController from "./profile.controller";

const router = express.Router();

router.get("/", accessMiddleware.verifyUser, profileController.getProfile);
router.post("/", accessMiddleware.verifyUser, profileController.createProfile);
router.patch(
  "/:id",
  accessMiddleware.verifyUser,
  profileController.updateProfile,
);

export default router;
