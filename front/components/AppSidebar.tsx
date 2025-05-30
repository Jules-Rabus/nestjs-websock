'use client';

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
} from '@/components/ui/sidebar';
import { authContext } from '@/providers/AuthProvider';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Chat as ChatType } from '@/app/actions/chat';
import { findAllChats } from '@/app/actions/chat';
import Link from 'next/link';

export function AppSidebar() {
  const { user } = useContext(authContext);
  const [chats, setChats] = useState<ChatType[]>([]);
  const router = useRouter();

  useEffect(() => {
    findAllChats()
      .then((res) => setChats(res.data))
      .catch((error) => console.error('Failed to fetch chats:', error));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const userAbreviation = useMemo(
    () => (user ? `${user.firstName[0]}${user.lastName[0]}` : ''),
    [user],
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Vos conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/chat/${chat.id}`}
                      className="flex items-center gap-2 w-full"
                    >
                      <span>{chat.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {user && (
        <SidebarFooter>
          <Avatar>
            <AvatarFallback>{userAbreviation}</AvatarFallback>
          </Avatar>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Se déconnecter
          </button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
