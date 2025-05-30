import { AxiosResponse } from 'axios';
import { api } from '@/lib/api';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  color: string;
}

export const getAll = (): Promise<AxiosResponse<User[]>> => {
  return api.get('/users');
};

export const getUserInfo = (): Promise<AxiosResponse<User>> => {
  return api.get('/users/me');
};
