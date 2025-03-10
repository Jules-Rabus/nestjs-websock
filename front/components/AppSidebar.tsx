"use client";

import { Home, Ticket } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authContext } from "@/providers/AuthProvider";
import { useContext, useMemo } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Tickets",
    url: "/tickets",
    icon: Ticket,
  },
];

export function AppSidebar() {
  const { user } = useContext(authContext);

  const userAbreviation = useMemo(
    () => (user ? `${user.firstName[0]}${user.lastName[0]}` : ""),
    [user]
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {user && (
        <SidebarFooter className="flex items-end">
          <Avatar>
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback>{userAbreviation}</AvatarFallback>
          </Avatar>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
