/**
 * Central navigation typing for the whole app.
 *
 * RootStackParamList is the single native-stack that sits at the top of the
 * app: Splash -> (Login | Register) when logged out, or Main (the tab
 * navigator) + Favorites when logged in. Favorites is deliberately NOT a tab
 * (per the specified bottom-tab structure: Accueil, Menu, Panier, Commandes,
 * Profil) — it's a screen pushed on top of the root stack, reachable from any
 * tab via navigation.navigate('Favorites'), which React Navigation resolves
 * by bubbling up to the parent stack automatically.
 */
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Favorites: undefined;
  MealDetail: { mealId: string };
  // Serves confirmation, receipt/QR, and live tracking for one order — the
  // design shows these as separate mockups, but they're really three views
  // of the same order at different points in its lifecycle, so one screen
  // with a status-aware layout covers all three without extra routes.
  OrderDetail: { orderId: string };
};

/**
 * MainTabParamList is the bottom-tab navigator shown once the user is
 * authenticated.
 */
export type MainTabParamList = {
  Home: undefined;
  Menu: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

// Lets useNavigation() / screenOptions infer route names and params without
// having to pass <RootStackParamList> generics at every call site.
declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}
