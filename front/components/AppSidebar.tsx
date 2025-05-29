"use client";

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
import {useContext, useEffect, useMemo, useState} from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Chat as ChatType} from "@/app/actions/chat";
import { findAllChats } from "@/app/actions/chat";

export function AppSidebar() {
  const { user } = useContext(authContext);
  const [chats, setChats] = useState<ChatType[]>([]);

  useEffect(async () => {
    const chats = await findAllChats();
    setChats(chats.data);
    }, []);

  const userAbreviation = useMemo(
    () => (user ? `${user.firstName[0]}${user.lastName[0]}` : ""),
    [user]
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Vos conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.title}>
                  <SidebarMenuButton asChild>
                    <a href={`/chat/${chat.id}`} className="flex items-center gap-2">
                      <span>{chat.title}</span>
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
