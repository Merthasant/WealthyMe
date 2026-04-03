export interface CreateProfileDTO {
  displayName?: string;
  birthDate?: number;
  profession?: string;
  avatarUrl?: string;
  timezone: string;
}
export interface UpdateProfileDTO {
  displayName?: string;
  birthDate?: number;
  profession?: string;
  avatarUrl?: string;
  timezone?: string;
}
