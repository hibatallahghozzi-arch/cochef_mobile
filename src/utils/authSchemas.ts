import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;


export const registerSchema = z.object({
  fullName: z.string().min(2, 'Nom requis'),
  email: z.string().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;