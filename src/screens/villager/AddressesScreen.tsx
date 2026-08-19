import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Card from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Addresses'
>;

export default function AddressesScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center border-b border-border bg-white px-4 py-4">
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          className="mr-3"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.text}
          />
        </Pressable>

        <Text className="font-sans-bold text-lg text-primary">
          Mes adresses
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-4 p-4"
      >
        {/* Empty state */}
        <Card className="items-center py-10">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Ionicons
              name="location-outline"
              size={30}
              color={colors.primary}
            />
          </View>

          <Text className="font-sans-semibold text-base text-text">
            Aucune adresse enregistrée
          </Text>

          <Text className="mt-2 px-6 text-center font-sans text-sm text-text-secondary">
            Vos adresses apparaîtront ici.
          </Text>
        </Card>

        {/* Add address */}
        <Pressable
          onPress={() => {
            // Address creation will be connected to the backend later.
          }}
        >
          <Card className="flex-row items-center justify-center gap-2">
            <Ionicons
              name="add-circle-outline"
              size={21}
              color={colors.primary}
            />

            <Text className="font-sans-semibold text-base text-primary">
              Ajouter une adresse
            </Text>
          </Card>
        </Pressable>
      </ScrollView>
    </View>
  );
}