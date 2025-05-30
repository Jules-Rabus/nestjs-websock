'use client';

import { Chat as ChatType } from '@/app/actions/chat';
import { SidebarMenuItem } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check, Edit2, Trash2, X } from 'lucide-react';
import React from 'react';

export default function ChatItem({
  chat,
  editingId,
  editingTitle,
  online,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onChangeTitle,
}: {
  chat: ChatType;
  editingId: number | null;
  editingTitle: string;
  online: Set<number>;
  onStartEdit: (c: ChatType) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
  onDelete: (id: number) => void;
  onChangeTitle: (s: string) => void;
}) {
  return (
    <SidebarMenuItem>
      <div className="flex items-center justify-between w-full px-2 py-1 hover:bg-gray-100 rounded">
        <Link href={`/chat/${chat.id}`} className="font-medium flex-1">
          {editingId === chat.id ? (
            <input
              className="w-full border rounded px-2 py-1 mt-2"
              value={editingTitle}
              onChange={(e) => onChangeTitle(e.target.value)}
            />
          ) : (
            <>
              <div>{chat.title}</div>
              <div className="flex -space-x-1 mt-2">
                {chat.participants.map((p) => {
                  const abbr = `${p.firstName[0]}${p.lastName[0]}`;
                  const isOn = online.has(p.id);
                  return (
                    <Avatar
                      key={p.id}
                      className="w-6 h-6 ring-2 ring-white"
                      title={`${p.firstName} ${p.lastName}`}
                    >
                      <AvatarFallback
                        className={`${isOn ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        {abbr}
                      </AvatarFallback>
                    </Avatar>
                  );
                })}
              </div>
            </>
          )}
        </Link>
        <div className="flex items-center space-x-1">
          {editingId === chat.id ? (
            <>
              <button onClick={() => onSaveEdit(chat.id)}>
                <Check size={16} />
              </button>
              <button onClick={onCancelEdit}>
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onStartEdit(chat)}>
                <Edit2 size={16} />
              </button>
              <button onClick={() => onDelete(chat.id)}>
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </SidebarMenuItem>
  );
}
