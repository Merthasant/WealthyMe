import { Prisma } from "@/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import { CreateProfileDTO, UpdateProfileDTO } from "@/lib/types/profile.type";
import { NotFoundError } from "@/lib/utils/error.utils";
import validationUtils from "@/lib/utils/validation.utils";

const profileSelect: Prisma.profileSelect = {
  id: true,
  displayName: true,
  birthDate: true,
  avatarUrl: true,
  profession: true,
  timezone: true,
  createdAt: true,
  updatedAt: true,
};

const profileService = {
  // find by user id
  async findByUserId(userId: string) {
    validationUtils.requiredValue(userId, "user id");

    return await prisma.$transaction(async (tx) => {
      // ambil data user dan profile dengan 1 query
      const userData = await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          profile: {
            where: { userId },
            select: profileSelect,
          },
        },
      });

      // validation user
      if (!userData) throw new NotFoundError("user not found!");

      // validation profile
      const profileData = userData.profile;
      if (!profileData) throw new NotFoundError("profile not found!");

      return profileData;
    });
  },

  // create
  async create(dto: CreateProfileDTO, userId: string) {
    validationUtils.requiredValue(userId, "user id");

    return await prisma.$transaction(async (tx) => {
      // validation user
      const userData = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!userData) throw new NotFoundError("user not found!");

      return await tx.profile.create({
        data: { ...dto, user: { connect: { id: userId } } },
        select: profileSelect,
      });
    });
  },

  // update by id
  async updateById(dto: UpdateProfileDTO, id: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(userId, "user id");

    return await prisma.$transaction(async (tx) => {
      // ambil data user dan profile dengan 1 query
      const userData = await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          profile: {
            where: { userId },
            select: { id: true },
          },
        },
      });

      // validation user
      if (!userData) throw new NotFoundError("user not found!");

      // validation profile
      const profileData = userData.profile;
      if (!profileData) throw new NotFoundError("profile not found!");

      const container: Prisma.profileUpdateInput = {
        ...(dto.avatarUrl && { avatarUrl: dto.avatarUrl }),
        ...(dto.birthDate && { birthDate: dto.birthDate }),
        ...(dto.displayName && { displayName: dto.displayName }),
        ...(dto.profession && { profession: dto.profession }),
        ...(dto.timezone && { timezone: dto.timezone }),
      };

      return await tx.profile.update({
        where: { id: profileData.id },
        data: container,
        select: profileSelect,
      });
    });
  },

  // belum di pakai, entah dipakai atau enggak
  // delete by id
  async deleteById(id: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(userId, "user id");

    return await prisma.$transaction(async (tx) => {
      // ambil data user dan profile dengan 1 query
      const userData = await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          profile: {
            where: { userId },
            select: { id: true },
          },
        },
      });

      // validation user
      if (!userData) throw new NotFoundError("user not found!");

      // validation profile
      const profileData = userData.profile;
      if (!profileData) throw new NotFoundError("profile not found!");

      return await tx.profile.delete({
        where: { id: profileData.id },
        select: profileSelect,
      });
    });
  },
};

export default profileService;
