'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getSocket } from '@/lib/api';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';
import {
  Chat as ChatType,
  findAllChats,
  handleUpdateChat,
  deleteChat,
} from '@/app/actions/chat';
import ChatItem from '@/components/ChatItem';
import UserFooter from '@/components/UserFooter';

export function AppSidebar() {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [online, setOnline] = useState<Set<number>>(new Set());

  useEffect(() => {
    findAllChats().then((r) => setChats(r.data));
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on('userOnline', ({ userId }) =>
      setOnline((o) => new Set(o).add(userId)),
    );
    socket.on('userOffline', ({ userId }) =>
      setOnline((o) => {
        const n = new Set(o);
        n.delete(userId);
        return n;
      }),
    );
    return () => {
      socket.disconnect();
    };
  }, []);

  const load = useCallback(
    () => findAllChats().then((r) => setChats(r.data)),
    [],
  );

  const startEdit = useCallback((c: ChatType) => {
    setEditingId(c.id);
    setEditingTitle(c.title);
  }, []);

  const saveEdit = useCallback(
    async (id: number) => {
      await handleUpdateChat(id, { title: editingTitle });
      setEditingId(null);
      setEditingTitle('');
      load();
    },
    [editingTitle, load],
  );

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingTitle('');
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Supprimer cette conversation ?')) return;
    await deleteChat(id);
    setChats((c) => c.filter((x) => x.id !== id));
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Vos conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  editingId={editingId}
                  editingTitle={editingTitle}
                  online={online}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  onDelete={handleDelete}
                  onChangeTitle={setEditingTitle}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <UserFooter />
    </Sidebar>
  );
}
