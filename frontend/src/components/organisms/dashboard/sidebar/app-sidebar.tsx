"use client";

import * as React from "react";

import { NavMain } from "@/components/organisms/dashboard/sidebar/nav-main";
import { NavUser } from "@/components/organisms/dashboard/sidebar/nav-user";
import { TeamSwitcher } from "@/components/organisms/dashboard/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LayoutBottomIcon,
  AudioWave01Icon,
  CommandIcon,
  CropIcon,
  PieChartIcon,
  MapsIcon,
  DashboardSquare02Icon,
  Wallet01Icon,
  TagsIcon,
  AccountSetting01Icon,
  TransactionHistoryIcon,
} from "@hugeicons/core-free-icons";
import type { NavMainType } from "@/lib/types/dashboard.type";

// This is sample data.
const dataaa = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <HugeiconsIcon icon={LayoutBottomIcon} strokeWidth={2} />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <HugeiconsIcon icon={AudioWave01Icon} strokeWidth={2} />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <HugeiconsIcon icon={CommandIcon} strokeWidth={2} />,
      plan: "Free",
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: <HugeiconsIcon icon={CropIcon} strokeWidth={2} />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <HugeiconsIcon icon={PieChartIcon} strokeWidth={2} />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <HugeiconsIcon icon={MapsIcon} strokeWidth={2} />,
    },
  ],
};

const navMain: NavMainType = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <HugeiconsIcon icon={DashboardSquare02Icon} strokeWidth={2} />,
    isActive: true,
  },
  {
    title: "Transactions",
    url: "transactions",
    icon: <HugeiconsIcon icon={TransactionHistoryIcon} strokeWidth={2} />,
    isActive: false,
  },
  {
    title: "Accounts",
    url: "accounts",
    icon: <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2} />,
  },
  {
    title: "Categories",
    url: "categories",
    icon: <HugeiconsIcon icon={TagsIcon} strokeWidth={2} />,
  },
  {
    title: "Profile",
    url: "profile",
    icon: <HugeiconsIcon icon={AccountSetting01Icon} strokeWidth={2} />,
  },
];
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={dataaa.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
