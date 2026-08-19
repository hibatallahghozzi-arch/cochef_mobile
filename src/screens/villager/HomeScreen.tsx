import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import Header from '@/components/common/Header';
import Mascot from '@/components/common/Mascot';
import MealCard from '@/components/common/MealCard';
import SpeechBubble from '@/components/ui/SpeechBubble';
import { colors } from '@/constants/colors';
import { useMeals } from '@/hooks/useMeals';
import type { MainTabParamList } from '@/navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

const MOCK_WAIT_MINUTES = 15;

export default function HomeScreen({ navigation }: Props) {
  const { data: meals, isLoading } = useMeals();

  const todayMeals = meals?.slice(0, 3) ?? [];

  const openDrawer = () => {
    const drawerNavigation = navigation.getParent();

    if (drawerNavigation) {
      drawerNavigation.dispatch(DrawerActions.openDrawer());
    }
  };

  const openNotifications = () => {
    navigation.getParent()?.getParent()?.navigate('Notifications');
  };

  return (
    <View className="flex-1 bg-background">
      <ImageBackground
        source={require('@/assets/images/pattern-background.png')}
        resizeMode="cover"
        className="flex-1"
        imageStyle={{
          opacity: 0.22,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 24,
          }}
        >
          {/* =========================
              HEADER
          ========================== */}
          <Header
            variant="home"
            onMenuPress={openDrawer}
            onNotificationPress={openNotifications}
            hasNotification
          />

          {/* =========================
              HERO SECTION
          ========================== */}
          <View className="overflow-hidden">
            <View className="min-h-[340px] px-4">

              {/* Speech bubble */}
              <View className="absolute left-5 top-5 z-10">
                <SpeechBubble
                  tailPosition="right"
                  accentColor={colors.pink}
                >
                  <Text className="font-sans-bold text-[21px] leading-7 text-primary">
                    Bonjour
                  </Text>

                  <Text className="font-sans-bold text-[19px] leading-6 text-orange">
                    cher villageois
                  </Text>

                  <Text className="font-sans-bold text-[19px] leading-6 text-primary">
                    à CoChef !
                  </Text>
                </SpeechBubble>
              </View>

              {/* =========================
                  JOSEF MASCOT
              ========================== */}
              <View className="absolute bottom-[-8px] right-[-8px] z-10">
                <Mascot size="xl" />
              </View>

              {/* Energy slogan */}
              <View className="absolute bottom-7 left-7 z-20">
                <Text className="font-sans-semibold italic text-[11px] text-primary">
                  Energy
                </Text>

                <Text className="font-sans-semibold italic text-[11px] text-orange">
                  creates
                </Text>

                <Text className="font-sans-semibold italic text-[11px] text-orange">
                  momentum.
                </Text>

                <View className="mt-1 h-[2px] w-16 rotate-[-5deg] rounded-full bg-orange" />
              </View>
            </View>
          </View>

          {/* =========================
              WAITING TIME
          ========================== */}
          <View className="px-4">
            <View
              className="rounded-2xl bg-white p-4"
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center">
                <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-orange/10">
                  <Ionicons
                    name="time-outline"
                    size={19}
                    color={colors.orange}
                  />
                </View>

                <Text className="font-sans-medium text-xs text-text-secondary">
                  Temps d'attente actuel
                </Text>
              </View>

              <View className="mt-1 flex-row items-end justify-center">
                <Text className="font-sans-bold text-[39px] leading-[44px] text-primary">
                  {MOCK_WAIT_MINUTES}
                </Text>

                <Text className="mb-1 ml-1 font-sans-semibold text-sm text-primary">
                  min
                </Text>
              </View>

              <Text className="text-center font-sans text-[9px] text-text-secondary">
                Actuellement
              </Text>
            </View>
          </View>

          {/* =========================
              MENU DU JOUR
          ========================== */}
          <View className="mt-5">
            <View className="mb-3 flex-row items-center justify-between px-4">
              <Text className="font-sans-bold text-base text-primary">
                Menu du jour
              </Text>

              <Pressable
                onPress={() => navigation.navigate('Menu')}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Voir le menu complet"
                className="flex-row items-center"
              >
                <Text className="font-sans text-xs text-text-secondary">
                  Voir tout
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={15}
                  color={colors.textSecondary}
                  style={{ marginLeft: 3 }}
                />
              </Pressable>
            </View>

            {isLoading ? (
              <View className="px-4">
                <Text className="font-sans text-sm text-text-secondary">
                  Chargement du menu...
                </Text>
              </View>
            ) : todayMeals.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 12,
                  gap: 8,
                }}
              >
                {todayMeals.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    variant="compact"
                    onPress={() => navigation.navigate('Menu')}
                    onAddPress={() => {
                      // TODO: Connect this to CartContext.
                    }}
                  />
                ))}
              </ScrollView>
            ) : (
              <View className="px-4">
                <View className="rounded-2xl bg-white p-5">
                  <Text className="text-center font-sans text-sm text-text-secondary">
                    Aucun plat disponible aujourd'hui.
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View className="h-4" />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}