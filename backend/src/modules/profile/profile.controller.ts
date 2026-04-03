import { catchAllErrors } from "@/lib/utils/error.utils";
import responseUtils from "@/lib/utils/response.utils";
import { Request, Response } from "express";
import profileService from "./profile.service";
import { CreateProfileDTO, UpdateProfileDTO } from "@/lib/types/profile.type";

const profileController = {
  // get profile
  async getProfile(req: Request, res: Response) {
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required!, unauthorized!",
      );
    try {
      const profileData = await profileService.findByUserId(userId);
      return responseUtils.success(
        res,
        200,
        "user founded successfully!",
        profileData,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // create profile
  async createProfile(req: Request, res: Response) {
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required!, unauthorized!",
      );

    const {
      timezone,
      avatarUrl,
      birthDate,
      displayName,
      profession,
    }: CreateProfileDTO = req.body;
    if (!timezone)
      return responseUtils.error(res, 400, "timezone is required!");
    try {
      await profileService.create(
        { timezone, avatarUrl, birthDate, displayName, profession },
        userId,
      );
      return responseUtils.success(res, 201, "profile created successfully");
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // update profile
  async updateProfile(req: Request, res: Response) {
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required!, unauthorized!",
      );

    const id = req.params.id;
    if (!id) return responseUtils.error(res, 400, "profile id is required!");

    const {
      timezone,
      avatarUrl,
      birthDate,
      displayName,
      profession,
    }: UpdateProfileDTO = req.body;
    if (!timezone && !avatarUrl && !birthDate && !displayName && !profession)
      return responseUtils.error(res, 400, "one data must be required!");
    try {
      await profileService.updateById(
        { avatarUrl, birthDate, displayName, profession, timezone },
        id.toString(),
        userId,
      );
      return responseUtils.success(res, 200, "profile updated successfully!");
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
};

export default profileController;
