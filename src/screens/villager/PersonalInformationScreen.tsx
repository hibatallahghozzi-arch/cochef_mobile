import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Card from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'PersonalInformation'
>;

export default function PersonalInformationScreen({
  navigation,
}: Props) {
  const { user } = useAuth();

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
          Informations personnelles
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-4 p-4"
      >
        {/* Full name */}
        <Card>
          <Text className="mb-2 font-sans-medium text-sm text-text">
            Nom complet
          </Text>

          <TextInput
            value={user?.fullName ?? ''}
            editable={false}
            className="rounded-xl border border-border bg-gray-50 px-4 py-3 font-sans text-base text-text"
          />
        </Card>

        {/* Email */}
        <Card>
          <Text className="mb-2 font-sans-medium text-sm text-text">
            Adresse e-mail
          </Text>

          <TextInput
            value={user?.email ?? ''}
            editable={false}
            keyboardType="email-address"
            autoCapitalize="none"
            className="rounded-xl border border-border bg-gray-50 px-4 py-3 font-sans text-base text-text"
          />
        </Card>

        {/* Phone */}
        <Card>
          <Text className="mb-2 font-sans-medium text-sm text-text">
            Téléphone
          </Text>

          <TextInput
            value={
              (user as { phone?: string } | null)?.phone ?? ''
            }
            editable={false}
            keyboardType="phone-pad"
            placeholder="Non renseigné"
            placeholderTextColor={colors.textSecondary}
            className="rounded-xl border border-border bg-gray-50 px-4 py-3 font-sans text-base text-text"
          />
        </Card>

        <Text className="px-2 text-center font-sans text-xs text-text-secondary">
          Ces informations sont associées à votre compte CoChef.
        </Text>
      </ScrollView>
    </View>
  );
}