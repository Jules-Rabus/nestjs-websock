import { AxiosResponse } from "axios";
import { api } from "@/lib/api";
import { User } from "./user";
import { Chat } from "./chat";

export interface Message {
  id: number;
  content: string;
  filePath: string | null;
  createdAt: string;
  updatedAt: string;
  author: User;
  chat: Chat;
}

export interface CreateMessage {
  content: string;
  chatId: number;
  file?: File;
}

export interface UpdateMessage {
  content?: string;
  file?: File;
}

export const findAllMessages = async (): Promise<AxiosResponse<Message[]>> => {
  return api.get("messages");
};

export const findOneMessage = async (
    id: number
): Promise<AxiosResponse<Message>> => {
  return api.get(`messages/${id}`);
};

export const addMessage = async (
    data: CreateMessage
): Promise<AxiosResponse<Message>> => {
  const formData = new FormData();
  formData.append("content", data.content);
  formData.append("chatId", data.chatId.toString());
  if (data.file) {
    formData.append("file", data.file);
  }
  return api.post("messages", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const handleUpdateMessage = async (
    id: number,
    data: UpdateMessage
): Promise<AxiosResponse<Message>> => {
  const formData = new FormData();
  if (data.content !== undefined) {
    formData.append("content", data.content);
  }
  if (data.file) {
    formData.append("file", data.file);
  }
  return api.patch(`messages/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};