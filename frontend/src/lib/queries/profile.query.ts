import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createProfile,
  deleteAvatarProfile,
  getProfile,
  updateProfile,
} from "../APIs/services/profile.service";
import { useAuthStore } from "@/store/auth.store";
import type {
  CreateInputProfile,
  UpdateInputProfile,
} from "../types/profile.type";
import type { MutationConfig } from "../types/query.type";

// get profile
const getAccessToken = () => useAuthStore.getState().accessToken;

export const getProfileQueryKey = () => ["profile", "get"];

const getProfileQueryOptions = () => {
  return {
    queryKey: getProfileQueryKey(),
    queryFn: getProfile,
  };
};

export const useGetProfile = () => {
  return useQuery({
    ...getProfileQueryOptions(),
    enabled: !!getAccessToken,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
};

// create profile
type CreateProfileParams = {
  mutationConfig?: MutationConfig<typeof createProfile>;
};

export const useCreateProfile = (params: CreateProfileParams = {}) => {
  return useMutation({
    mutationFn: (data: CreateInputProfile) => createProfile(data),
    ...params.mutationConfig,
  });
};

// update profile
type UpdateProfileParams = {
  mutationConfig?: MutationConfig<typeof updateProfile>;
};

export const useUpdateProfile = (params: UpdateProfileParams = {}) => {
  return useMutation({
    mutationFn: (data: UpdateInputProfile) => updateProfile(data),
    ...params.mutationConfig,
  });
};

// delete avatar profile
type DeleteAvatarProfileParams = {
  mutationConfig?: MutationConfig<typeof deleteAvatarProfile>;
};

export const useDeleteAvatarProfile = (
  params: DeleteAvatarProfileParams = {},
) => {
  return useMutation({
    mutationFn: () => deleteAvatarProfile(),
    ...params.mutationConfig,
  });
};
