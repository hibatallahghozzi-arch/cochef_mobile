import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/services/auth.api';
import { setUnauthorizedHandler } from '@/services/api';
import { secureStorage } from '@/utils/secureStorage';
import type { LoginPayload, RegisterPayload, User } from '@/types/auth';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  /** True while checking SecureStore for an existing session on app boot. */
  isBooting: boolean;
  /** True while a login or register request is in flight. */
  isSubmitting: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;

    // On boot: if a token is already in SecureStore, confirm it's still
    // valid (via /auth/me) before deciding the user is authenticated.
    (async () => {
      const token = await secureStorage.getToken();
      if (!token) {
        if (isMounted) setIsBooting(false);
        return;
      }
      try {
        const me = await authApi.me();
        if (isMounted) setUser(me);
      } catch {
        await secureStorage.clearToken();
      } finally {
        if (isMounted) setIsBooting(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Any 401 from api.ts (expired/invalid token) forces a logout.
    setUnauthorizedHandler(() => {
      setUser(null);
      void secureStorage.clearToken();
    });
  }, []);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async ({ user: loggedInUser, accessToken }) => {
      await secureStorage.setToken(accessToken);
      setUser(loggedInUser);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async ({ user: registeredUser, accessToken }) => {
      await secureStorage.setToken(accessToken);
      setUser(registeredUser);
    },
  });

  const login = async (payload: LoginPayload) => {
    await loginMutation.mutateAsync(payload);
  };

const register = async (payload: RegisterPayload) => {
  console.log("AUTH CONTEXT REGISTER:", payload);

  await registerMutation.mutateAsync(payload);
};

  const logout = async () => {
    await secureStorage.clearToken();
    setUser(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isBooting,
        isSubmitting: loginMutation.isPending || registerMutation.isPending,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
