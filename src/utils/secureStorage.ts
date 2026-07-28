import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'cochef_access_token';

/**
 * SecureStore is the right place for the JWT (not AsyncStorage): it's
 * backed by Keychain on iOS and EncryptedSharedPreferences on Android.
 */
export const secureStorage = {
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  },
  async clearToken(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  },
};
