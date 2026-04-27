import { catchAllErrors } from "@/lib/utils/error.utils";
import responseUtils from "@/lib/utils/response.utils";
import { Request, Response } from "express";
import profileService from "./profile.service";
import { CreateProfileDTO, UpdateProfileDTO } from "@/lib/types/profile.type";
import cloudinaryUtils from "@/lib/utils/cloudinary.utils";

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
      const dto = await profileService.findByUserId(userId);
      return responseUtils.success(res, 200, "user founded successfully!", dto);
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

    const file = req.file;

    const { displayName, birthDate, timezone, profession } =
      req.validatedBody as CreateProfileDTO;
    if (!timezone)
      return responseUtils.error(res, 400, "timezone is required!");
    try {
      const { avatarPublicId, avatarUrl } =
        await profileService.uploadAvatar(file);

      const dto = await profileService.create(
        {
          timezone,
          avatarUrl,
          avatarPublicId,
          birthDate,
          displayName,
          profession,
        },
        userId,
      );
      return responseUtils.success(
        res,
        201,
        "profile created successfully",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  async deleteAvatarOnly(req: Request, res: Response) {
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required!, unauthorized!",
      );

    try {
      const dto = await profileService.deleteAvatarOnly(userId);
      return responseUtils.success(
        res,
        200,
        "Avatar deleted successfully!",
        dto,
      );
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

    const file = req.file;

    if (!req.body) {
      return responseUtils.error(
        res,
        400,
        "at least one data must be required!",
      );
    }

    const { timezone, birthDate, displayName, profession } =
      req.validatedBody as UpdateProfileDTO;

    if (!timezone && !file && !birthDate && !displayName && !profession)
      return responseUtils.error(
        res,
        400,
        "at least one data must be required!",
      );
    try {
      // hapus data avatar lama jika ada file baru yang diupload
      if (file) {
        const oldAvatarPublicId =
          await profileService.getAvatarPublicIdByUserId(userId);
        if (oldAvatarPublicId) {
          await cloudinaryUtils.deleteFromCloudinary(oldAvatarPublicId);
        }
      }

      const { avatarPublicId, avatarUrl } =
        await profileService.uploadAvatar(file);

      const dto = await profileService.updateById(
        {
          avatarUrl,
          avatarPublicId,
          birthDate,
          displayName,
          profession,
          timezone,
        },
        userId,
      );
      return responseUtils.success(
        res,
        200,
        "profile updated successfully!",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
};

export default profileController;
