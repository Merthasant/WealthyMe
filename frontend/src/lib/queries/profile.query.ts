import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../APIs/services/profile.service";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile", "get"],
    queryFn: () => getProfile(),
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
};
