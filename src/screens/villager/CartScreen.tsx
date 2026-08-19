import { useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useCart, type CartItem } from '@/contexts/CartContext';
import { useCreateOrder } from '@/hooks/useOrders';
import type {
  MainTabParamList,
  RootStackParamList,
} from '@/navigation/types';
import type { PaymentMethod } from '@/types/order';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Cart'>,
  NativeStackScreenProps<RootStackParamList>
>;

const PAYMENT_METHODS: {
  key: PaymentMethod;
  label: string;
  icon: string;
}[] = [
  {
    key: 'CASH',
    label: 'Espèces',
    icon: '💵',
  },
  {
    key: 'CHECK',
    label: 'Chèque',
    icon: '📄',
  },
  {
    key: 'NFC',
    label: 'Carte NFC',
    icon: '💳',
  },
  {
    key: 'RESTAURANT_TICKET',
    label: 'Ticket restaurant',
    icon: '🎫',
  },
];

export default function CartScreen({ navigation }: Props) {
  const {
    items,
    updateQuantity,
    removeItem,
    clear,
    subtotal,
  } = useCart();

  const createOrder = useCreateOrder();

  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('CASH');

  const total = subtotal;

  const onConfirm = async () => {
    if (items.length === 0) {
      return;
    }

    setIsConfirming(true);

    try {
      const order = await createOrder.mutateAsync({
        paymentMethod,
        items: items.map((item) => ({
          mealId: item.meal.id,
          quantity: item.quantity,
        })),
      });

      clear();

      navigation.navigate('OrderDetail', {
        orderId: order.id,
      });
    } catch (error) {
      console.error('Failed to create order:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon="cart-outline"
        title="Votre panier est vide"
        subtitle="Ajoutez des plats depuis le menu du jour."
        actionLabel="Voir le menu"
        onActionPress={() => navigation.navigate('Menu')}
      />
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList<CartItem>
        data={items}
        keyExtractor={(item) => item.meal.id}
        contentContainerStyle={{
          padding: 16,
          gap: 12,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const unitPrice = Number(item.meal.price);
          const itemTotal = unitPrice * item.quantity;

          return (
            <View className="rounded-2xl border border-border bg-white p-3">
              <View className="flex-row items-center gap-3">
                {item.meal.imageUrl ? (
                  <Image
                    source={{ uri: item.meal.imageUrl }}
                    className="h-16 w-16 rounded-xl"
                  />
                ) : (
                  <View className="h-16 w-16 items-center justify-center rounded-xl bg-background">
                    <Text className="text-2xl">🍽️</Text>
                  </View>
                )}

                <View className="flex-1">
                  <Text
                    numberOfLines={2}
                    className="font-sans-semibold text-base text-text"
                  >
                    {item.meal.name}
                  </Text>

                  <Text className="mt-1 font-sans-semibold text-sm text-primary">
                    {unitPrice.toFixed(2)} DT
                  </Text>

                  {item.quantity > 1 ? (
                    <Text className="mt-1 font-sans text-xs text-text-secondary">
                      {unitPrice.toFixed(2)} DT × {item.quantity} ={' '}
                      {itemTotal.toFixed(2)} DT
                    </Text>
                  ) : null}
                </View>

                <Pressable
                  onPress={() => removeItem(item.meal.id)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Retirer ${item.meal.name} du panier`}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#E51955"
                  />
                </Pressable>
              </View>

              <View className="mt-3 flex-row items-center justify-between border-t border-border pt-3">
                <Text className="font-sans-medium text-sm text-text-secondary">
                  Quantité
                </Text>

                <View className="flex-row items-center rounded-xl bg-background">
                  <Pressable
                    onPress={() =>
                      updateQuantity(
                        item.meal.id,
                        item.quantity - 1,
                      )
                    }
                    hitSlop={8}
                    className="h-9 w-9 items-center justify-center"
                    accessibilityRole="button"
                    accessibilityLabel="Diminuer la quantité"
                  >
                    <Text className="font-sans-bold text-xl text-primary">
                      −
                    </Text>
                  </Pressable>

                  <Text className="w-8 text-center font-sans-semibold text-base text-text">
                    {item.quantity}
                  </Text>

                  <Pressable
                    onPress={() =>
                      updateQuantity(
                        item.meal.id,
                        item.quantity + 1,
                      )
                    }
                    hitSlop={8}
                    className="h-9 w-9 items-center justify-center"
                    accessibilityRole="button"
                    accessibilityLabel="Augmenter la quantité"
                  >
                    <Text className="font-sans-bold text-xl text-primary">
                      +
                    </Text>
                  </Pressable>
                </View>

                <Text className="font-sans-semibold text-sm text-primary">
                  {itemTotal.toFixed(2)} DT
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View className="border-t border-border bg-white p-4">
        <Text className="mb-3 font-sans-semibold text-base text-text">
          Mode de paiement
        </Text>

        <View className="gap-2">
          {PAYMENT_METHODS.map((method) => {
            const selected = paymentMethod === method.key;

            return (
              <Pressable
                key={method.key}
                onPress={() => setPaymentMethod(method.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                className={`flex-row items-center rounded-xl border p-3 ${
                  selected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-white'
                }`}
              >
                <Text className="mr-3 text-xl">{method.icon}</Text>

                <Text
                  className={`flex-1 font-sans-medium text-sm ${
                    selected ? 'text-primary' : 'text-text'
                  }`}
                >
                  {method.label}
                </Text>

                <View
                  className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
                    selected
                      ? 'border-primary'
                      : 'border-border'
                  }`}
                >
                  {selected ? (
                    <View className="h-2.5 w-2.5 rounded-full bg-primary" />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-4 gap-2">
          <View className="flex-row justify-between">
            <Text className="font-sans text-sm text-text-secondary">
              Sous-total
            </Text>

            <Text className="font-sans text-sm text-text">
              {subtotal.toFixed(2)} DT
            </Text>
          </View>

          <View className="flex-row justify-between border-t border-border pt-3">
            <Text className="font-sans-semibold text-base text-text">
              Total
            </Text>

            <Text className="font-sans-bold text-lg text-primary">
              {total.toFixed(2)} DT
            </Text>
          </View>
        </View>

        <View className="mt-3">
          <Button
            label="Confirmer la commande"
            variant="accent"
            onPress={onConfirm}
            loading={isConfirming}
          />
        </View>
      </View>
    </View>
  );
}