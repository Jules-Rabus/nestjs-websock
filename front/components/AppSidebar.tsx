'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { authContext } from '@/providers/AuthProvider';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Chat as ChatType,
  findAllChats,
  handleUpdateChat,
  deleteChat,
} from '@/app/actions/chat';
import { Edit2, Trash2, Check, X } from 'lucide-react';

export function AppSidebar() {
  const { user } = useContext(authContext);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const router = useRouter();

  useEffect(() => {
    load();
  }, []);

  const load = () =>
    findAllChats()
      .then((res) => setChats(res.data))
      .catch((err) => console.error(err));

  const startEdit = (chat: ChatType) => {
    setEditingId(chat.id);
    setEditingTitle(chat.title);
  };

  const saveEdit = async (id: number) => {
    await handleUpdateChat(id, { title: editingTitle });
    setEditingId(null);
    setEditingTitle('');
    load();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette conversation ?')) return;
    await deleteChat(id);
    setChats((prev) => prev.filter((c) => c.id !== id));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const userAbbr = useMemo(
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
                  <div className="flex items-center justify-between w-full px-2 py-1 hover:bg-gray-100 rounded">
                    <Link
                      href={`/chat/${chat.id}`}
                      className="font-medium flex-1"
                    >
                      {chat.title}
                      <div>
                        {editingId === chat.id && (
                          <input
                            className="w-full border rounded px-2 py-1"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                          />
                        )}

                        {editingId !== chat.id && (
                          <div className="flex -space-x-1 mt-2">
                            {chat.participants.map((p) => {
                              const abbr = `${p.firstName[0]}${p.lastName[0]}`;
                              return (
                                <Avatar
                                  key={p.id}
                                  className="w-6 h-6 ring-2 ring-white"
                                >
                                  <AvatarFallback>{abbr}</AvatarFallback>
                                </Avatar>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="flex items-center space-x-1">
                      {editingId === chat.id ? (
                        <>
                          <button onClick={() => saveEdit(chat.id)}>
                            <Check size={16} />
                          </button>
                          <button onClick={cancelEdit}>
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="cursor-pointer"
                            onClick={() => startEdit(chat)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="cursor-pointer"
                            onClick={() => handleDelete(chat.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {user && (
        <SidebarFooter className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{userAbbr}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{user.firstName}</span>
          </div>
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
