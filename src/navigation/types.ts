/**
 * Central navigation typing for the whole app.
 *
 * RootStackParamList is the single native-stack that sits at the top of the
 * app:
 *
 * Splash -> (Login | Register) when logged out
 *
 * or
 *
 * Main (Drawer + Bottom Tabs) + additional villager screens when logged in.
 *
 * Favorites, MealDetail, OrderDetail, Feedback, PersonalInformation,
 * Addresses and Notifications are deliberately NOT tabs.
 * They are screens pushed on top of the root stack.
 */

export type RootStackParamList = {
  Splash: undefined;

  Login: undefined;

  Register: undefined;

  /**
   * Main application container.
   * Contains the DrawerNavigator, which contains MainTabNavigator.
   */
  Main: undefined;

  /**
   * Villager screens outside the bottom tabs.
   */
  Favorites: undefined;

  MealDetail: {
    mealId: string;
  };

  OrderDetail: {
    orderId: string;
  };

  /**
   * Feedback screen.
   *
   * Allows the villager to:
   * - rate their experience from 1 to 5 stars
   * - leave an optional comment
   */
  Feedback: undefined;

  /**
   * Personal information screen.
   */
  PersonalInformation: undefined;

  /**
   * Addresses screen.
   */
  Addresses: undefined;

  /**
   * Notifications screen.
   */
  Notifications: undefined;
};

/**
 * MainTabParamList is the bottom-tab navigator shown once
 * the user is authenticated.
 *
 * Bottom tabs:
 * Accueil
 * Menu
 * Panier
 * Commandes
 * Profil
 */
export type MainTabParamList = {
  Home: undefined;
  Menu: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

/**
 * Allows useNavigation() and other React Navigation APIs
 * to automatically know about the root-level routes.
 */
declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}