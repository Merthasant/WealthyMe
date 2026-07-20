import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { UnfoldMoreIcon, LogoutIcon } from "@hugeicons/core-free-icons";
import { useGetProfile } from "@/lib/queries/profile.query";
import { getUiAvatarUrlRandomColor } from "@/lib/utils/avatar-generate.utils";
import { useAuthLogout, useAuthMe } from "@/lib/queries/auth.query";
import { useAuthStore } from "@/store/auth.store";
import { navigateTo } from "@/lib/utils/navigate.utils";
import { useProfileStore } from "@/store/profile.store";
import { useQueryClient } from "@tanstack/react-query";

// function reusable untuk avatar url
const getAvatarImageUrl = (
  avatarUrl: string | undefined | null,
  displayname: string | undefined | null,
  username: string,
): string => {
  if (avatarUrl) return avatarUrl;
  if (displayname) return getUiAvatarUrlRandomColor({ name: displayname });
  return getUiAvatarUrlRandomColor({ name: username });
};

export function NavUser() {
  // mobile device hook
  const { isMobile } = useSidebar();
  // store
  const logoutAuthStore = useAuthStore((s) => s.logout);
  const resetProfile = useProfileStore((s) => s.resetProfile);
  // query client
  const queryClient = useQueryClient();

  // get user
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useAuthMe();
  // get user profile
  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetProfile();

  // lebih reusable
  const avatarImageUrl = getAvatarImageUrl(
    profileData?.data?.avatarUrl,
    profileData?.data?.displayName,
    userData?.data?.name ?? "unknown",
  );

  // mutate logout query, success() ====>> clear ====>> navigate to login page
  const mutateLogout = useAuthLogout({
    mutationConfig: {
      onSuccess: () => {
        // clear semua query
        queryClient.clear();
        logoutAuthStore();
        resetProfile();
        // gak perlu, karena udah di protected route nge-handle ----
        navigateTo("/sign-in");
        // --> buat jaga"
      },
    },
  });

  if (profileLoading || userLoading) return <h1>woop.</h1>;
  if (profileError) alert("profile error");
  if (userError) alert("user Error");

  const logoutHandler = async () => {
    await mutateLogout.mutateAsync(undefined);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={avatarImageUrl}
                  alt={userData?.data?.name ?? "unknown"}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {profileData?.data?.displayName ?? userData?.data?.name}
                </span>
                <span className="truncate text-xs">
                  {userData?.data?.email ?? "unknown"}
                </span>
              </div>
              <HugeiconsIcon
                icon={UnfoldMoreIcon}
                strokeWidth={2}
                className="ml-auto size-4"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={avatarImageUrl}
                    alt={userData?.data?.name ?? "unknown"}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {profileData?.data?.displayName ?? userData?.data?.name}
                  </span>
                  <span className="truncate text-xs">
                    {userData?.data?.email ?? "unknown"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutHandler}>
              <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
