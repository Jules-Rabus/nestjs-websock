import React, { useState, useCallback } from 'react';
import { addMessage } from '@/app/actions/message';

export default function MessageInput({ chatId }: { chatId: number }) {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && (input.trim() || file)) {
        e.preventDefault();
        handleSend();
      }
    },
    [input, file, handleSend],
  );

  return (
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
        onChange={(e) => setInput(e.target.value)}
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
  );
}
