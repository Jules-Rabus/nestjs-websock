'use client';

import React, { useState, useEffect } from 'react';
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

export type MessageWithEdit = MessageType & { isEditing?: boolean };

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const chatId = Number(id);
  const [chat, setChat] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<MessageWithEdit[]>([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [editText, setEditText] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    findOneChat(chatId).then((res) => {
      setChat(res.data);
      const initialMessages = res.data.messages.map((m) => ({
        ...m,
        isEditing: false,
      }));
      setMessages(initialMessages);

      initialMessages.forEach((message) => {
        if (
          message.authorId !== currentUser.id &&
          !message.readBy.some((u) => u.id === currentUser.id)
        ) {
          markRead(message.id);
        }
      });
    });
  }, [chatId]);

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
            msg.authorId !== currentUser.id &&
            !msg.readBy.some((u) => u.id === currentUser.id)
          ) {
            markRead(msg.id);
          }
          return [...prev, { ...msg, isEditing: false }];
        }
      });
    };
    return () => es.close();
  }, [chatId]);

  const handleSend = () => {
    if ((!input.trim() && !file) || !chat) return;
    addMessage({ content: input, chatId, file: file || undefined });
    setInput('');
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const startEdit = (msg: MessageWithEdit) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, isEditing: true } : m)),
    );
    setEditText(msg.content);
  };

  const saveEdit = async (msg: MessageWithEdit) => {
    const res = await handleUpdateMessage(msg.id, {
      content: editText,
    });
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msg.id ? { ...res.data, isEditing: false } : m,
      ),
    );
    setEditText('');
  };

  const cancelEdit = (msg: MessageWithEdit) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, isEditing: false } : m)),
    );
    setEditText('');
  };

  if (!chat) return <div className="p-4">Loading…</div>;

  return (
    <div className="flex flex-col h-full">
      <ParticipantsBar participants={chat.participants} />
      <MessagesList
        messages={messages}
        currentUserId={currentUser.id}
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
