import axios from 'axios';

import { secureStorage } from '@/utils/secureStorage';

// NestJS backend (PC IP)
const API_BASE_URL = 'http://192.168.11.36:3000/api/v1';
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  console.log(
    '🚀 REQUEST URL:',
    `${config.baseURL ?? ''}${config.url ?? ''}`,
  );

  const token = await secureStorage.getToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(
  handler: UnauthorizedHandler,
): void {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onUnauthorized?.();
    }

    return Promise.reject(error);
  },
);