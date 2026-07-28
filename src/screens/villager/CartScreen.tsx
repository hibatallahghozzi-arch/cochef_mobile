import { useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useCart, type CartItem } from '@/contexts/CartContext';
import { useCreateOrder } from '@/hooks/useOrders';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Cart'>,
  NativeStackScreenProps<RootStackParamList>
>;

const SERVICE_FEE = 2;

export default function CartScreen({ navigation }: Props) {
  const { items, updateQuantity, removeItem, clear, subtotal } = useCart();
  const createOrder = useCreateOrder();
  const [isConfirming, setIsConfirming] = useState(false);

  const total = subtotal + (items.length > 0 ? SERVICE_FEE : 0);

  const onConfirm = async () => {
    setIsConfirming(true);
    try {
      const order = await createOrder.mutateAsync({
        items: items.map((item) => ({ mealId: item.meal.id, quantity: item.quantity })),
      });
      clear();
      navigation.navigate('OrderDetail', { orderId: order.id });
    } catch {
      // TODO: surface a proper error toast once a shared notification
      // pattern exists — for now the confirm button just re-enables.
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
        contentContainerClassName="gap-3 p-4"
        renderItem={({ item }) => (
          <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-white p-3">
            {item.meal.imageUrl ? (
              <Image source={{ uri: item.meal.imageUrl }} className="h-14 w-14 rounded-xl" />
            ) : null}
            <View className="flex-1">
              <Text className="font-sans-semibold text-base text-text">{item.meal.name}</Text>
              <Text className="font-sans-semibold text-sm text-primary">{item.meal.price.toFixed(2)}€</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Pressable onPress={() => updateQuantity(item.meal.id, item.quantity - 1)} hitSlop={8}>
                <Text className="font-sans-bold text-lg text-primary">−</Text>
              </Pressable>
              <Text className="font-sans-semibold text-base text-text">{item.quantity}</Text>
              <Pressable onPress={() => updateQuantity(item.meal.id, item.quantity + 1)} hitSlop={8}>
                <Text className="font-sans-bold text-lg text-primary">+</Text>
              </Pressable>
            </View>
            <Pressable onPress={() => removeItem(item.meal.id)} hitSlop={8} accessibilityLabel="Retirer du panier">
              <Text className="font-sans text-sm text-pink">Retirer</Text>
            </Pressable>
          </View>
        )}
      />

      <View className="gap-2 border-t border-border bg-white p-4">
        <View className="flex-row justify-between">
          <Text className="font-sans text-sm text-text-secondary">Sous-total</Text>
          <Text className="font-sans text-sm text-text">{subtotal.toFixed(2)}€</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-sans text-sm text-text-secondary">Frais de service</Text>
          <Text className="font-sans text-sm text-text">{SERVICE_FEE.toFixed(2)}€</Text>
        </View>
        <View className="flex-row justify-between border-t border-border pt-2">
          <Text className="font-sans-semibold text-base text-text">Total</Text>
          <Text className="font-sans-semibold text-base text-text">{total.toFixed(2)}€</Text>
        </View>

        <View className="mt-2">
          <Button label="Confirmer la commande" variant="accent" onPress={onConfirm} loading={isConfirming} />
        </View>
      </View>
    </View>
  );
}
