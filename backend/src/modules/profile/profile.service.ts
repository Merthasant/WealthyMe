import { Prisma } from "@/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import { CreateProfileDTO, UpdateProfileDTO } from "@/lib/types/profile.type";
import { NotFoundError } from "@/lib/utils/error.utils";
import validationUtils from "@/lib/utils/validation.utils";

const profileService = {
  // find by user id
  async findByUserId(userId: string) {
    validationUtils.requiredValue(userId, "user id");

    return await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { id: userId } });
      if (!existingUser) throw new NotFoundError("user not found!");

      const profileData = await tx.profile.findUnique({
        where: { userId },
      });
      if (!profileData) throw new NotFoundError("profile not found!");

      return profileData;
    });
  },

  // create
  async create(dto: CreateProfileDTO, userId: string) {
    validationUtils.requiredValue(userId, "user id");

    return await prisma.profile.create({
      data: { ...dto, user: { connect: { id: userId } } },
    });
  },

  // update by id
  async updateById(dto: UpdateProfileDTO, id: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(userId, "user id");

    return await prisma.$transaction(async (tx) => {
      const existingProfile = await tx.profile.findUnique({
        where: { id, user: { id: userId } },
      });
      if (!existingProfile) throw new NotFoundError("profile not found!");

      const container: Prisma.profileUpdateInput = {
        ...(dto.avatarUrl && { avatarUrl: dto.avatarUrl }),
        ...(dto.birthDate && { birthDate: dto.birthDate }),
        ...(dto.displayName && { displayName: dto.displayName }),
        ...(dto.profession && { profession: dto.profession }),
        ...(dto.timezone && { timezone: dto.timezone }),
      };

      return await tx.profile.update({
        where: { id: existingProfile.id },
        data: container,
      });
    });
  },

  // delete by id
  async deleteById(id: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(userId, "user id");

    return await prisma.$transaction(async (tx) => {
      const existingProfile = await tx.profile.findUnique({
        where: { id, user: { id: userId } },
      });
      if (!existingProfile) throw new NotFoundError("profile not found!");

      return await tx.profile.delete({ where: { id: existingProfile.id } });
    });
  },
};

export default profileService;
