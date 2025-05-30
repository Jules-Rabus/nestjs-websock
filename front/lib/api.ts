import axios from 'axios';
import { io } from 'socket.io-client';

export const api = axios.create({
  baseURL: 'http://localhost:3002',
});

export const getToken = () => {
  return localStorage.getItem('token') || null;
};

export const socket = io('http://localhost:3002');

api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
      const userJson = localStorage.getItem('user');

      if (userJson) {
        try {
          const { id: userId } = JSON.parse(userJson);
          socket.emit('userOnline', { userId });
        } catch {
          console.error('Error sending userOnline event: Invalid user data');
        }
      }
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);
