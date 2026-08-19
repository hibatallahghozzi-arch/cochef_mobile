import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import EmptyState from '@/components/ui/EmptyState';
import Loader from '@/components/ui/Loader';
import { colors } from '@/constants/colors';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import type { Order, OrderStatus } from '@/types/order';
import { useOrders } from '@/hooks/useOrders';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Orders'>,
  NativeStackScreenProps<RootStackParamList>
>;

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Commande reçue',
  CONFIRMED: 'Commande confirmée',
  PREPARING: 'En préparation',
  READY: 'Prête',
  COLLECTED: 'Récupérée',
  DECLINED: 'Refusée',
};

export default function OrdersScreen({ navigation }: Props) {
  const { data: orders, isLoading, refetch, isRefetching } = useOrders();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <FlatList<Order>
      data={orders ?? []}
      keyExtractor={(order) => order.id}
      className="flex-1 bg-background"
      contentContainerClassName="gap-3 p-4"
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.primary}
        />
      }
      ListEmptyComponent={
        <EmptyState
          icon="receipt-outline"
          title="Aucune commande"
          subtitle="Vos commandes passées apparaîtront ici."
        />
      }
      renderItem={({ item: order }) => (
        <Pressable
          onPress={() =>
            navigation.navigate('OrderDetail', { orderId: order.id })
          }
          className="rounded-2xl border border-border bg-white p-4"
        >
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-base text-text">
              Commande #{order.id}
            </Text>

            <Text className="font-sans-semibold text-sm text-primary">
              {Number(order.totalPrice).toFixed(2)}DT
            </Text>
          </View>

          <Text className="mt-1 font-sans text-sm text-text-secondary">
            {STATUS_LABELS[order.status]}
          </Text>
        </Pressable>
      )}
    />
  );
}