'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, getAll } from '@/app/actions/user';
import { addChat } from '@/app/actions/chat';

export default function CreateChatPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [participants, setParticipants] = useState<number[]>([]);

  useEffect(() => {
    getAll()
      .then((users) => {
        setUsers(users.data);
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err);
      });
  }, []);

  const toggleParticipant = (userId: number) => {
    setParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || participants.length === 0) return;
    try {
      const res = await addChat({ title, participants });
      router.push(`/chat/${res.data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Chat</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none"
            placeholder="Chat title"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Participants</label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-2 rounded">
            {users.map((user) => (
              <label
                key={user.id}
                className={`flex items-center space-x-2 p-2 border rounded cursor-pointer ${
                  participants.includes(user.id)
                    ? 'bg-blue-100 border-blue-400'
                    : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={participants.includes(user.id)}
                  onChange={() => toggleParticipant(user.id)}
                  className="form-checkbox"
                />
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
          disabled={!title.trim() || participants.length === 0}
        >
          Create Chat
        </button>
      </form>
    </div>
  );
}
