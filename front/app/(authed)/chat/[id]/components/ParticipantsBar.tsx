import { User } from '@/app/actions/user';
import React from 'react';

export default function ParticipantsBar({
  participants,
}: {
  participants: User[];
}) {
  return (
    <div className="flex space-x-2 p-2 bg-gray-100 border-b">
      {participants.map((p) => (
        <div
          key={p.id}
          className="px-2 py-1 bg-blue-500 text-white rounded-full text-sm"
        >
          {p.firstName} {p.lastName}
        </div>
      ))}
    </div>
  );
}
