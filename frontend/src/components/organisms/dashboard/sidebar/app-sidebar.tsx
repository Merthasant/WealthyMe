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
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  History,
  LayoutDashboard,
  Tags,
  User,
  Wallet,
} from "lucide-react";
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
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
};

const navMain: NavMainType = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Transactions",
    url: "transactions",
    icon: History,
    isActive: false,
  },
  {
    title: "Accounts",
    url: "accounts",
    icon: Wallet,
  },
  {
    title: "Categories",
    url: "categories",
    icon: Tags,
  },
  {
    title: "Profile",
    url: "profile",
    icon: User,
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
