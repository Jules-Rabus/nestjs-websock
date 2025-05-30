import Image from 'next/image';
import React from 'react';
import { MessageWithEdit } from '@/app/(authed)/chat/[id]/page';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isEditable(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < 5 * 60 * 1000;
}

export default function MessageItem({
  msg,
  currentUserId,
  participantsCount,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  editText,
  setEditText,
}: {
  msg: MessageWithEdit;
  currentUserId: number;
  participantsCount: number;
  onStartEdit: (m: MessageWithEdit) => void;
  onSaveEdit: (m: MessageWithEdit) => void;
  onCancelEdit: (m: MessageWithEdit) => void;
  editText: string;
  setEditText: (s: string) => void;
}) {
  const isOwn = msg.authorId === currentUserId;
  const isImage = (path: string) => /\.(png|jpe?g|gif|webp|avif)$/.test(path);
  const readCount = msg.readBy.length;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative rounded-lg p-3 max-w-xs ${
          isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs">{formatTime(msg.createdAt)}</span>
          {msg.readBy.length > 0 && isOwn && (
            <span className="text-[10px]">
              {' '}
              {readCount} / {participantsCount - 1}
            </span>
          )}
        </div>
        {msg.isEditing ? (
          <>
            <input
              className="w-full border rounded px-2 py-1 mb-1"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => onSaveEdit(msg)}
                className="text-sm text-green-600"
              >
                Save
              </button>
              <button
                onClick={() => onCancelEdit(msg)}
                className="text-sm text-red-600"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div>{msg.content}</div>
            {msg.filePath && isImage(msg.filePath) && (
              <Image
                src={`/api/media/${msg.filePath}`}
                alt=""
                width={150}
                height={150}
                className="rounded mt-1"
              />
            )}
            {msg.filePath && !isImage(msg.filePath) && (
              <a
                href={`/api/media/${msg.filePath}`}
                download
                className="underline text-xs"
              >
                Télécharger
              </a>
            )}
            {isOwn && isEditable(msg.createdAt) && (
              <button
                onClick={() => onStartEdit(msg)}
                className="absolute top-1 right-1 text-[10px] opacity-50 hover:opacity-100"
              >
                Edit
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
