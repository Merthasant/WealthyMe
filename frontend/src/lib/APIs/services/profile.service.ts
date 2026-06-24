import type { ApiResponse } from "@/lib/types/api.type";
import instance from "../axios";
import type {
  CreateInputProfile,
  Profile,
  UpdateInputProfile,
} from "@/lib/types/profile.type";
import { toFormData } from "axios";

// get profile
export const getProfile = async (): Promise<ApiResponse<Profile | null>> => {
  const response = await instance.get<ApiResponse<Profile | null>>("/profile");
  return response.data;
};

// create profile
export const createProfile = async (
  data: CreateInputProfile,
): Promise<ApiResponse<Profile | null>> => {
  const { birthDate, ...rest } = data;
  const formData = toFormData({
    ...rest,
    birthDate: birthDate?.toString(),
  });
  const response = await instance.post<ApiResponse<Profile | null>>(
    "/profile",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};
// update profile
export const updateProfile = async (
  data: UpdateInputProfile,
): Promise<ApiResponse<Profile | null>> => {
  const { birthDate, ...rest } = data;

  const formData = toFormData({
    ...rest,
    birthDate: birthDate?.toString(),
  });

  const response = await instance.patch<ApiResponse<Profile | null>>(
    "/profile",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

// delete avatar profile
export const deleteAvatarProfile = async (): Promise<
  ApiResponse<Profile | null>
> => {
  const response =
    await instance.patch<ApiResponse<Profile | null>>("/profile/avatar");
  return response.data;
};
