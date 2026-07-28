import { ScrollView, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import Card from '@/components/ui/Card';
import Mascot from '@/components/common/Mascot';
import SpeechBubble from '@/components/ui/SpeechBubble';
import Button from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { useMeals } from '@/hooks/useMeals';
import type { MainTabParamList } from '@/navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

// TODO: no waiting-time endpoint exists yet in the API layer (Phase 7) — this
// is a placeholder until the backend exposes real cafeteria wait times.
const MOCK_WAIT_MINUTES = 8;

export default function HomeScreen({ navigation }: Props) {
  const { data: meals } = useMeals();

  const totalMeals = meals?.length ?? 0;
  const specialMeals = meals?.filter((meal) => (meal.tags?.length ?? 0) > 0).length ?? 0;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-4 gap-4">
      <View className="flex-row items-end justify-between gap-3">
        <SpeechBubble tailPosition="right" accentColor={colors.pink}>
          <Text className="font-sans-bold text-lg text-primary">Bonjour</Text>
          <Text className="font-sans-bold text-lg text-orange">cher villegois</Text>
          <Text className="font-sans-bold text-lg text-primary">à CoChef !</Text>
        </SpeechBubble>
        <Mascot size="md" />
      </View>

      <Card>
        <Text className="font-sans text-sm text-text-secondary">Temps d'attente actuel</Text>
        <View className="mt-1 flex-row items-center justify-between">
          <Text className="font-sans-bold text-3xl text-primary">{MOCK_WAIT_MINUTES} min</Text>
          <View className="rounded-full bg-green/15 px-3 py-1">
            <Text className="font-sans-medium text-xs text-green">Faible</Text>
          </View>
        </View>
      </Card>

      <Card className="flex-row items-center justify-between">
        <View>
          <Text className="font-sans-semibold text-base text-text">Aujourd'hui</Text>
          <Text className="font-sans text-sm text-text-secondary">
            {totalMeals} plats disponibles, {specialMeals} spéciaux
          </Text>
        </View>
      </Card>

      <Button label="Voir le menu du jour" onPress={() => navigation.navigate('Menu')} />
    </ScrollView>
  );
}
