import { Image, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Header from '@/components/common/Header';
import Loader from '@/components/ui/Loader';
import { colors } from '@/constants/colors';
import { useOrder } from '@/hooks/useOrders';
import type { RootStackParamList } from '@/navigation/types';
import type { OrderStatus } from '@/types/order';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'received', label: 'Commande reçue' },
  { key: 'preparing', label: 'En préparation' },
  { key: 'cooking', label: 'En cuisson' },
  { key: 'ready', label: 'Prête' },
  { key: 'collected', label: 'Récupérée' },
];

export default function OrderDetailScreen({ route, navigation }: Props) {
  const { orderId } = route.params;
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading || !order) {
    return <Loader fullScreen />;
  }

  const currentStepIndex = STATUS_STEPS.findIndex((step) => step.key === order.status);

  return (
    <View className="flex-1 bg-background">
      <Header title={`Commande #${order.id}`} onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        {order.status === 'received' ? (
          <View className="items-center gap-2 rounded-2xl border border-border bg-white p-6">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-green/15">
              <Ionicons name="checkmark" size={28} color={colors.green} />
            </View>
            <Text className="font-sans-semibold text-lg text-text">Commande confirmée !</Text>
            <Text className="text-center font-sans text-sm text-text-secondary">
              Votre commande est en cours de préparation.
            </Text>
          </View>
        ) : null}

        {order.qrCodeUrl ? (
          <View className="items-center gap-2 rounded-2xl border border-border bg-white p-4">
            <Image source={{ uri: order.qrCodeUrl }} className="h-40 w-40" resizeMode="contain" />
            <Text className="font-sans text-xs text-text-secondary">Présentez ce code au comptoir</Text>
          </View>
        ) : null}

        <View className="rounded-2xl border border-border bg-white p-4">
          <Text className="mb-2 font-sans-semibold text-base text-text">Détails</Text>
          {order.items.map((item) => (
            <View key={item.meal.id} className="flex-row justify-between py-1">
              <Text className="font-sans text-sm text-text">
                {item.meal.name} x{item.quantity}
              </Text>
              <Text className="font-sans text-sm text-text">{(item.meal.price * item.quantity).toFixed(2)}€</Text>
            </View>
          ))}
          <View className="mt-2 flex-row justify-between border-t border-border pt-2">
            <Text className="font-sans-semibold text-sm text-text">Total</Text>
            <Text className="font-sans-semibold text-sm text-text">{order.total.toFixed(2)}€</Text>
          </View>
          {order.estimatedWaitMinutes ? (
            <Text className="mt-2 font-sans text-xs text-text-secondary">
              Temps d'attente estimé : {order.estimatedWaitMinutes} min
            </Text>
          ) : null}
        </View>

        <View className="rounded-2xl border border-border bg-white p-4">
          <Text className="mb-3 font-sans-semibold text-base text-text">Suivi de commande</Text>
          {STATUS_STEPS.map((step, index) => {
            const isDone = index <= currentStepIndex;
            return (
              <View key={step.key} className="flex-row items-center gap-3 py-1.5">
                <View
                  className={`h-3 w-3 rounded-full ${isDone ? 'bg-secondary' : 'bg-border'}`}
                />
                <Text className={`font-sans text-sm ${isDone ? 'text-text' : 'text-text-secondary'}`}>
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
