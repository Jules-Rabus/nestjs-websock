import { AxiosResponse } from 'axios';
import { api, getToken } from '@/lib/api';
import { User } from './user';
import { Message } from 'postcss';

export interface Chat {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  participants: User[];
}

export interface CreateChat {
  title: string;
  participants: number[];
}

export interface UpdateChat {
  title?: string;
  participants?: number[];
}

export const findAllChats = async (): Promise<AxiosResponse<Chat[]>> => {
  return api.get('chats');
};

export const findOneChat = async (id: number): Promise<AxiosResponse<Chat>> => {
  return api.get(`chats/${id}`);
};

export const addChat = async (
  data: CreateChat,
): Promise<AxiosResponse<Chat>> => {
  return api.post('chats', data);
};

export const handleUpdateChat = async (
  id: number,
  data: UpdateChat,
): Promise<AxiosResponse<Chat>> => {
  return api.patch(`chats/${id}`, data);
};

export const getEventSourceChat = (chatId: number): EventSource => {
  const token = getToken();
  const url = `${api.defaults.baseURL}/messages/events/${chatId}?token=${token}`;
  return new EventSource(url);
};
