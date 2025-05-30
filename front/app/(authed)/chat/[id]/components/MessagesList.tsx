import React from 'react';
import MessageItem from '@/app/(authed)/chat/[id]/components/MessageItem';
import { MessageWithEdit } from '@/app/(authed)/chat/[id]/page';

export default function MessagesList({
  messages,
  currentUserId,
  editText,
  setEditText,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}: {
  messages: MessageWithEdit[];
  currentUserId: number;
  editText: string;
  setEditText: (s: string) => void;
  onStartEdit: (m: MessageWithEdit) => void;
  onSaveEdit: (m: MessageWithEdit) => void;
  onCancelEdit: (m: MessageWithEdit) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          msg={msg}
          currentUserId={currentUserId}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          editText={editText}
          setEditText={setEditText}
        />
      ))}
    </div>
  );
}
