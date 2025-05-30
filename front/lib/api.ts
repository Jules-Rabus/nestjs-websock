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
    const token = localStorage.getItem('token') || null;

    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);
