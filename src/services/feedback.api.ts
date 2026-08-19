import { api } from './api';

export interface Feedback {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFeedbackPayload {
  rating: number;
  comment?: string;
}

export const feedbackApi = {
  create: async (
    payload: CreateFeedbackPayload,
  ): Promise<Feedback> => {
    const response = await api.post<Feedback>(
      '/feedback',
      payload,
    );

    return response.data;
  },

  getMine: async (): Promise<Feedback | null> => {
    const response = await api.get<Feedback | null>(
      '/feedback/me',
    );

    return response.data;
  },

  update: async (
    payload: CreateFeedbackPayload,
  ): Promise<Feedback> => {
    const response = await api.patch<Feedback>(
      '/feedback',
      payload,
    );

    return response.data;
  },
};