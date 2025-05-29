'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { findOneChat, Chat as ChatType, getEventSourceChat } from '@/app/actions/chat';
import { addMessage, Message as MessageType } from '@/app/actions/message';
import { User } from '@/app/actions/user';
import Image from 'next/image';

const ParticipantsBar: React.FC<{ participants: User[] }> = ({ participants }) => (
    <div className="flex space-x-2 p-2 bg-gray-100 border-b">
        {participants.map(p => (
            <div key={p.id} className="px-2 py-1 bg-blue-500 text-white rounded-full text-sm">
                {p.firstName} {p.lastName}
            </div>
        ))}
    </div>
);

const formatTime = (isoDate: string) =>
    new Date(isoDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

type InputProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSend: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    hasFile: boolean;
};

const MessageInput: React.FC<InputProps> = ({ value, onChange, onSend, onFileChange, hasFile }) => (
    <div className="p-4 border-t flex items-center space-x-2">
        <label
            htmlFor="fileInput"
            className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
        >
            📎
        </label>
        <input id="fileInput" type="file" accept="image/*,.pdf" className="hidden" onChange={onFileChange} />
        <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
            placeholder="Write a message"
            value={value}
            onChange={onChange}
        />
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full disabled:opacity-50"
            onClick={onSend}
            disabled={!value.trim() && !hasFile}
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
    const [file, setFile] = useState<File | null>(null);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        findOneChat(chatId).then(res => {
            setChat(res.data);
            setMessages(res.data.messages);
        });
    }, [chatId]);

    useEffect(() => {
        const eventSource = getEventSourceChat(chatId);
        eventSource.onmessage = event => {
            const msg: MessageType = JSON.parse(event.data);
            setMessages(prev => [...prev, msg]);
        };
        return () => {
            eventSource.close();
        };
    }, [chatId]);

    const handleSend = () => {
        if ((!input.trim() && !file) || !chat) return;
        if (file && !/^image\//.test(file.type) && file.type !== 'application/pdf') {
            setFile(null);
            return;
        }
        addMessage({ content: input, chatId, file: file ?? undefined });
        setInput('');
        setFile(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        if (f && (/^image\//.test(f.type) || f.type === 'application/pdf')) {
            setFile(f);
        } else {
            setFile(null);
        }
    };

    if (!chat) return <div className="p-4">Loading…</div>;

    const isImage = (path: string) => /\.(png|jpe?g|gif|webp|avif)$/.test(path.toLowerCase());

    return (
        <div className="flex flex-col h-full">
            <ParticipantsBar participants={chat.participants} />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map(msg => {
                    const isOwn = msg.authorId === currentUser.id;
                    const author = chat.participants.find(p => p.id === msg.authorId);
                    const authorName = isOwn ? 'Moi' : author ? `${author.firstName} ${author.lastName}` : 'Unknown';
                    return (
                        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
                  relative rounded-lg px-3 py-2 max-w-xs`}
                            >
                                <div className="text-sm mb-1">{authorName}</div>
                                <div className="pr-8 space-y-2">
                                    {msg.content && <div>{msg.content}</div>}
                                    {msg.filePath && isImage(msg.filePath) && (
                                        <Image
                                            src={`/api/media/${msg.filePath}`}
                                            alt="media"
                                            width={200}
                                            height={200}
                                            className="rounded-lg"
                                        />
                                    )}
                                    {msg.filePath && (
                                        <a
                                            href={`/api/media/${msg.filePath}`}
                                            download
                                            className="text-xs underline"
                                        >
                                            Télécharger
                                        </a>
                                    )}
                                </div>
                                <span
                                    className={`absolute bottom-1 right-2 text-[10px] leading-none
                    ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}
                                >
                  {formatTime(msg.createdAt)}
                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <MessageInput
                value={input}
                onChange={e => setInput(e.target.value)}
                onSend={handleSend}
                onFileChange={handleFileChange}
                hasFile={!!file}
            />
        </div>
    );
}
