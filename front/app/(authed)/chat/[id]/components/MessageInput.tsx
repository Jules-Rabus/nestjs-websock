import React from 'react';

export default function MessageInput({
  value,
  onChange,
  onSend,
  file,
  onFileChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (value.trim() || file)) {
      e.preventDefault();
      onSend();
    }
  };

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
        onChange={onFileChange}
      />
      <input
        type="text"
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
        placeholder="Write a message"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-full disabled:opacity-50"
        onClick={onSend}
        disabled={!value.trim() && !file}
      >
        Send
      </button>
    </div>
  );
}
