'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { findOneChat, Chat as ChatType } from '@/app/actions/chat';
import { addMessage, Message as MessageType } from '@/app/actions/message';
import { User } from '@/app/actions/user';

const ParticipantsBar: React.FC<{ participants: User[] }> = ({ participants }) => (
    <div className="flex space-x-2 p-2 bg-gray-100 border-b">
        {participants.map(p => (
            <div
                key={p.id}
                className="px-2 py-1 bg-blue-500 text-white rounded-full text-sm"
            >
                {p.firstName} {p.lastName}
            </div>
        ))}
    </div>
);

const MessageInput: React.FC<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSend: () => void;
}> = ({ value, onChange, onSend }) => (
    <div className="p-4 border-t flex">
        <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 mr-2 focus:outline-none"
            placeholder="Write a message"
            value={value}
            onChange={onChange}
        />
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full disabled:opacity-50"
            onClick={onSend}
            disabled={!value.trim()}
        >
            Send
        </button>
    </div>
);

export default function ChatPage() {
    const { id } = useParams<{ id: string }>();
    const chatId = Number(id);
    const [chat, setChat] = useState<ChatType | null>(null);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [input, setInput] = useState('');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        findOneChat(chatId).then(res => {
            setChat(res.data);
            setMessages(res.data.messages);
        });
    }, [chatId]);

    const handleSend = async () => {
        if (!input.trim() || !chat) return;
        try {
            const res = await addMessage({ content: input, chatId, file: undefined });
            setMessages(prev => [...prev, res.data]);
            setInput('');
        } catch (err) {
            console.error(err);
        }
    };

    if (!chat) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="flex flex-col h-full">
            <ParticipantsBar participants={chat.participants} />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map(msg => {
                    const isOwn = msg.authorId === currentUser.id;
                    const author = chat.participants.find(p => p.id === msg.authorId);
                    const authorName = isOwn ? 'Moi'
                        : author
                            ? `${author.firstName} ${author.lastName}`
                            : 'Unknown';

                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`${
                                    isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                                } rounded-lg p-3 max-w-xs`}
                            >
                                <div className="text-sm mb-1">{authorName}</div>
                                <div>{msg.content}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <MessageInput
                value={input}
                onChange={e => setInput(e.target.value)}
                onSend={handleSend}
            />
        </div>
    );
}