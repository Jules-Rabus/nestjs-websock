'use client';

import React, { useState, useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarFooter } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit2, Check, X } from 'lucide-react';
import { api } from '@/lib/api';
import { authContext } from '@/providers/AuthProvider';
import { getSocket } from '@/lib/api';

export default function UserFooter() {
  const { user, setUser } = useContext(authContext);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [color, setColor] = useState('');

  const onSave = async () => {
    const socket = getSocket();
    const res = await api.patch(`users/${user.id}`, {
      firstName,
      lastName,
      color,
    });
    setUser(res.data);
    socket.emit('userChange', {
      userId: user.id,
      user: { firstName, lastName, color },
    });
    localStorage.setItem('user', JSON.stringify(res.data));
    setIsEditing(false);
  };

  const onOpenEdit = () => {
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setColor(user.color || '#aaaaaa');
    setIsEditing(true);
  };

  const onLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const abbr = useMemo(() => {
    if (!user) return;
    return `${user.firstName[0]}${user.lastName[0]}`;
  }, [user]);

  return (
    <SidebarFooter className="flex flex-col items-center justify-between p-4">
      <div className="flex justify-between items-center w-full flex-wrap">
        <Avatar style={{ backgroundColor: color }}>
          <AvatarFallback>{abbr}</AvatarFallback>
        </Avatar>
        {isEditing ? (
          <>
            <input
              className="w-full border rounded"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="w-full border rounded"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="color"
              className="w-full border-0 p-0 w-8 h-8"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <button onClick={onSave}>
              <Check size={16} />
            </button>
            <button onClick={onOpenEdit}>
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <span className="text-sm">
              {user?.firstName} {user?.lastName}
            </span>
            <button onClick={onOpenEdit}>
              <Edit2 size={16} />
            </button>
          </>
        )}
      </div>
      <button
        onClick={onLogout}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Se déconnecter
      </button>
    </SidebarFooter>
  );
}
