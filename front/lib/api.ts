import axios from 'axios';
import { io } from 'socket.io-client';

export const api = axios.create({
  baseURL: 'http://localhost:3002',
});

export const getToken = () => {
  return localStorage.getItem('token') || null;
};

export const getSocket = () => {
  const token = getToken();
  return io('http://localhost:3002', {
    auth: {
      token: token,
    },
  });
};

api.interceptors.request.use(
  function (config) {
    const token = getToken();

    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
      const userJson = localStorage.getItem('user');

      if (userJson) {
        try {
          const { id: userId } = JSON.parse(userJson);
          if (!userId) return;
          const socket = getSocket();
          socket.emit('userOnline', { userId });
        } catch (error) {
          console.error('Error sending userOnline', error);
        }
      }
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);
