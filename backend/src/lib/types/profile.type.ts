export interface CreateProfileDTO {
  displayName?: string;
  birthDate?: number;
  profession?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  timezone: string;
}
export interface UpdateProfileDTO {
  displayName?: string;
  birthDate?: number;
  profession?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  timezone?: string;
}
