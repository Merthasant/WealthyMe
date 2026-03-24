import express from "express";
import userController from "./user.controller.js";

const router = express.Router();

router.get("/", userController.getAllUser);
router.get("/:id", userController.getOneUser);
router.post("/", userController.createUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
