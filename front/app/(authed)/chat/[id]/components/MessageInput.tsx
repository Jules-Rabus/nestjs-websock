import React, { useState, useCallback, useRef, useEffect } from 'react';
import { addMessage } from '@/app/actions/message';
import { getSocket } from '@/lib/api';
import { User } from '@/app/actions/user';

export default function MessageInput({
  chatId,
  userId,
  participants,
}: {
  chatId: number;
  userId: number;
  participants: User[];
}) {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [typingUsers, setTypingUsers] = useState<number[]>([]);
  const lastEmitRef = useRef<number>(0);

  const handleSend = useCallback(() => {
    if (!input.trim() && !file) return;
    addMessage({ content: input, chatId, file: file || undefined });
    setInput('');
    setFile(null);
  }, [input, file, chatId]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFile(e.target.files?.[0] || null);
    },
    [],
  );

  const handleTyping = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
      const now = Date.now();
      if (now - lastEmitRef.current > 3000) {
        const socket = getSocket();
        socket.emit('userTyping', { chatId, userId });
        lastEmitRef.current = now;
      }
    },
    [chatId, userId],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && (input.trim() || file)) {
        e.preventDefault();
        handleSend();
      }
    },
    [input, file, handleSend],
  );

  useEffect(() => {
    const socket = getSocket();

    const onUserTyping = ({
      chatId: cid,
      userId: uid,
    }: {
      chatId: number;
      userId: number;
    }) => {
      if (cid !== chatId || uid === userId) return;
      setTypingUsers((prev) => {
        if (prev.includes(uid)) return prev;
        return [...prev, uid];
      });
    };

    const onStopTyping = ({
      chatId: cid,
      userId: uid,
    }: {
      chatId: number;
      userId: number;
    }) => {
      if (cid !== chatId) return;
      setTypingUsers((prev) => prev.filter((id) => id !== uid));
    };

    socket.on('userTyping', onUserTyping);
    socket.on('stopTyping', onStopTyping);

    return () => {
      socket.off('userTyping', onUserTyping);
      socket.off('stopTyping', onStopTyping);
    };
  }, [chatId, userId]);

  const typingDisplay = typingUsers
    .map((uid) => participants.find((p) => p.id === uid))
    .filter(Boolean) as User[];

  return (
    <div>
      {typingDisplay.length > 0 && (
        <div className="mb-2 flex space-x-2">
          {typingDisplay.map((user) => (
            <span
              key={user.id}
              className="badge badge-ghost badge-sm flex items-center space-x-1"
            >
              <span>{user.firstName} est en train d&#39;écrire...</span>
            </span>
          ))}
        </div>
      )}
      <div className="p-4 border-t flex items-center space-x-2">
        <label
          htmlFor="fileInput"
          className="cursor-pointer w-8 h-8 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300"
        >
          📎
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          placeholder="Write a message"
          value={input}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full disabled:opacity-50"
          onClick={handleSend}
          disabled={!input.trim() && !file}
        >
          Send
        </button>
      </div>
    </div>
  );
}
