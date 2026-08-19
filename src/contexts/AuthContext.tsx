import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/services/auth.api';
import { setUnauthorizedHandler } from '@/services/api';
import { registerForPushNotificationsAsync } from '@/services/notifications';
import { secureStorage } from '@/utils/secureStorage';

import type {
  LoginPayload,
  RegisterPayload,
  User,
} from '@/types/auth';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isBooting: boolean;
  isSubmitting: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isBooting, setIsBooting] = useState(true);

  const queryClient = useQueryClient();

  /*
   * Restore authentication when the app starts.
   */
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const token = await secureStorage.getToken();

        if (!token) {
          return;
        }

        const me = await authApi.me();

        if (isMounted) {
          setUser(me);
        }
      } catch (error) {
        console.log(
          'Session restore failed:',
          error,
        );

        await secureStorage.clearToken();

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsBooting(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
   * If the API returns 401, automatically log the user out.
   */
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      void secureStorage.clearToken();
      queryClient.clear();
    });
  }, [queryClient]);

  /*
   * Login
   */
  const loginMutation = useMutation({
    mutationFn: authApi.login,

    onSuccess: async ({
      user: loggedInUser,
      accessToken,
    }) => {
      console.log(
        'LOGIN SUCCESS:',
        loggedInUser,
      );

      await secureStorage.setToken(accessToken);

      setUser(loggedInUser);

      /*
       * Push notifications are optional.
       * A notification error must NOT make login fail.
       */
      try {
        console.log(
          'Registering for push notifications...',
        );

        const expoPushToken =
          await registerForPushNotificationsAsync();

        if (expoPushToken) {
          console.log(
            'Sending push token to backend...',
          );

          await authApi.updatePushToken(
            expoPushToken,
          );

          console.log(
            'Push token saved successfully',
          );
        }
      } catch (error) {
        console.log(
          'Push notification setup failed:',
          error,
        );
      }
    },
  });

  /*
   * Register
   */
  const registerMutation = useMutation({
    mutationFn: authApi.register,

    onSuccess: async ({
      user: registeredUser,
      accessToken,
    }) => {
      console.log(
        'REGISTER SUCCESS:',
        registeredUser,
      );

      await secureStorage.setToken(accessToken);

      setUser(registeredUser);

      /*
       * Push notifications are optional.
       */
      try {
        console.log(
          'Registering for push notifications...',
        );

        const expoPushToken =
          await registerForPushNotificationsAsync();

        if (expoPushToken) {
          await authApi.updatePushToken(
            expoPushToken,
          );

          console.log(
            'Push token saved successfully',
          );
        }
      } catch (error) {
        console.log(
          'Push notification setup failed:',
          error,
        );
      }
    },
  });

  /*
   * Public login function
   */
  const login = async (
    payload: LoginPayload,
  ): Promise<void> => {
    await loginMutation.mutateAsync(payload);
  };

  /*
   * Public register function
   */
  const register = async (
    payload: RegisterPayload,
  ): Promise<void> => {
    await registerMutation.mutateAsync(payload);
  };

  /*
   * Logout
   */
  const logout = async (): Promise<void> => {
    await secureStorage.clearToken();

    setUser(null);

    queryClient.clear();
  };

  const isSubmitting =
    loginMutation.isPending ||
    registerMutation.isPending;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isBooting,
        isSubmitting,
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
    throw new Error(
      'useAuth must be used within an AuthProvider',
    );
  }

  return context;
}