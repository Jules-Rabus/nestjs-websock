'use client';

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  findOneChat,
  Chat as ChatType,
  getEventSourceChat,
} from '@/app/actions/chat';
import {
  addMessage,
  Message as MessageType,
  handleUpdateMessage,
  markRead,
} from '@/app/actions/message';
import ParticipantsBar from '@/app/(authed)/chat/[id]/components/ParticipantsBar';
import MessagesList from '@/app/(authed)/chat/[id]/components/MessagesList';
import MessageInput from '@/app/(authed)/chat/[id]/components/MessageInput';
import { authContext } from '@/providers/AuthProvider';

export type MessageWithEdit = MessageType & { isEditing?: boolean };

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const chatId = Number(id);
  const [chat, setChat] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<MessageWithEdit[]>([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [editText, setEditText] = useState('');
  const { user } = useContext(authContext);

  useEffect(() => {
    if (!user) return;

    findOneChat(chatId).then((res) => {
      setChat(res.data);
      const initialMessages = res.data.messages.map((m) => ({
        ...m,
        isEditing: false,
      }));
      setMessages(initialMessages);

      initialMessages.forEach((message) => {
        if (
          message.authorId !== user.id &&
          !message.readBy.some((u) => u.id === user.id)
        ) {
          markRead(message.id);
        }
      });
    });
  }, [user, chatId]);

  useEffect(() => {
    const es = getEventSourceChat(chatId);
    es.onmessage = (e) => {
      const msg: MessageType = JSON.parse(e.data);
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        if (exists) {
          return prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m));
        } else {
          if (
            msg.authorId !== user.id &&
            !msg.readBy.some((u) => u.id === user.id)
          ) {
            markRead(msg.id);
          }
          return [...prev, { ...msg, isEditing: false }];
        }
      });
    };
    return () => es.close();
  }, [user, chatId]);

  const handleSend = () => {
    if ((!input.trim() && !file) || !chat) return;
    addMessage({ content: input, chatId, file: file || undefined });
    setInput('');
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const startEdit = useCallback((msg: MessageWithEdit) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, isEditing: true } : m)),
    );
    setEditText(msg.content);
  }, []);

  const saveEdit = useCallback(
    async (msg: MessageWithEdit) => {
      const res = await handleUpdateMessage(msg.id, { content: editText });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? { ...res.data, isEditing: false } : m,
        ),
      );
      setEditText('');
    },
    [editText],
  );

  const cancelEdit = useCallback((msg: MessageWithEdit) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, isEditing: false } : m)),
    );
    setEditText('');
  }, []);

  if (!chat) return <div className="p-4">Loading…</div>;

  return (
    <div className="flex flex-col h-full">
      <ParticipantsBar participants={chat.participants} />
      <MessagesList
        messages={messages}
        currentUser={user}
        participants={chat.participants}
        editText={editText}
        setEditText={setEditText}
        onStartEdit={startEdit}
        onSaveEdit={saveEdit}
        onCancelEdit={cancelEdit}
      />
      <MessageInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSend={handleSend}
        file={file}
        onFileChange={handleFileChange}
      />
    </div>
  );
}
