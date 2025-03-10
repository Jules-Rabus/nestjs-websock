import { AxiosResponse } from "axios";
import { api } from "../../lib/api";
import { User } from "./user";

export interface Ticket {
  id: number;
  title: string;
  content: string;
  status: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
  filePath: string | null;
  createdAt: Date;
  updatedAt: Date;
  participants: User[];
  reviewers: User[];
}

interface TicketCreate {
  title: string;
  content: string;
}

export interface TicketUpdate {
  status?: Ticket["status"];
  participants?: string[];
  reviewers?: string[];
}

export const findAllTickets = async (): Promise<AxiosResponse<Ticket[]>> => {
  return api.get("tickets");
};

export const findOneTicket = async (
  id: number
): Promise<AxiosResponse<Ticket>> => {
  return api.get(`tickets/${id}`);
};

export const addTicket = async (
  data: TicketCreate
): Promise<AxiosResponse<Ticket>> => {
  return api.post("tickets", data);
};

export const handleUpdateTicket = async (
  id: number,
  data: TicketUpdate
): Promise<AxiosResponse<Ticket>> => {
  return api.patch(`tickets/${id}`, { ...data });
};
