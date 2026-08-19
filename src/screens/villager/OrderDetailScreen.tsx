import React, { useEffect, useState } from 'react';

import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Rect,
} from 'react-native-svg';

import qrcode from 'qrcode-generator';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Header from '@/components/common/Header';
import Loader from '@/components/ui/Loader';

import { colors } from '@/constants/colors';

import { useOrder } from '@/hooks/useOrders';

import type { RootStackParamList } from '@/navigation/types';
import type { OrderStatus } from '@/types/order';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'OrderDetail'
>;

const josef = require('@/assets/josef.png');

const patternBackground = require(
  '@/assets/images/pattern-background.png',
);

const STATUS_STEPS: {
  key: OrderStatus;
  label: string;
}[] = [
  {
    key: 'PENDING',
    label: 'Commande reçue',
  },
  {
    key: 'CONFIRMED',
    label: 'Commande confirmée',
  },
  {
    key: 'PREPARING',
    label: 'En préparation',
  },
  {
    key: 'READY',
    label: 'Prête',
  },
  {
    key: 'COLLECTED',
    label: 'Récupérée',
  },
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Commande reçue',
  CONFIRMED: 'Commande confirmée',
  PREPARING: 'En préparation',
  READY: 'Prête',
  COLLECTED: 'Récupérée',
  DECLINED: 'Refusée',
};

const QR_PREFIX = 'COCHEF:ORDER:';

interface QRData {
  modules: boolean[][];
  size: number;
}

function generateQRData(
  value: string,
): QRData | null {
  try {
    const qr = qrcode(
      0,
      'M',
    );

    qr.addData(
      value,
      'Byte',
    );

    qr.make();

    const size =
      qr.getModuleCount();

    const modules: boolean[][] = [];

    for (
      let row = 0;
      row < size;
      row += 1
    ) {
      const currentRow: boolean[] = [];

      for (
        let col = 0;
        col < size;
        col += 1
      ) {
        currentRow.push(
          qr.isDark(
            row,
            col,
          ),
        );
      }

      modules.push(currentRow);
    }

    return {
      modules,
      size,
    };
  } catch (error) {
    console.error(
      'QR generation error:',
      error,
    );

    return null;
  }
}

function QRCodeView({
  value,
}: {
  value: string;
}) {
  const [qrData, setQrData] =
    useState<QRData | null>(null);

  useEffect(() => {
    const generated =
      generateQRData(value);

    setQrData(generated);
  }, [value]);

  if (!qrData) {
    return (
      <View className="h-48 w-48 items-center justify-center rounded-xl bg-background">
        <Text className="text-center font-sans text-xs text-text-secondary">
          Génération du QR code...
        </Text>
      </View>
    );
  }

  const displaySize = 192;

  const quietZone = 4;

  const totalModules =
    qrData.size +
    quietZone * 2;

  const moduleSize =
    displaySize /
    totalModules;

  return (
    <Svg
      width={displaySize}
      height={displaySize}
      viewBox={`0 0 ${displaySize} ${displaySize}`}
    >
      <Rect
        x={0}
        y={0}
        width={displaySize}
        height={displaySize}
        fill="white"
      />

      {qrData.modules.map(
        (row, rowIndex) =>
          row.map(
            (isDark, colIndex) => {
              if (!isDark) {
                return null;
              }

              return (
                <Rect
                  key={`${rowIndex}-${colIndex}`}
                  x={
                    (colIndex +
                      quietZone) *
                    moduleSize
                  }
                  y={
                    (rowIndex +
                      quietZone) *
                    moduleSize
                  }
                  width={
                    moduleSize + 0.1
                  }
                  height={
                    moduleSize + 0.1
                  }
                  fill={
                    colors.primary
                  }
                />
              );
            },
          ),
      )}
    </Svg>
  );
}

export default function OrderDetailScreen({
  route,
  navigation,
}: Props) {
  const { orderId } =
    route.params;

  const {
    data: order,
    isLoading,
  } = useOrder(orderId);

  if (
    isLoading ||
    !order
  ) {
    return (
      <Loader fullScreen />
    );
  }

  const currentStepIndex =
    STATUS_STEPS.findIndex(
      (step) =>
        step.key ===
        order.status,
    );

  const isDeclined =
    order.status ===
    'DECLINED';

  const qrValue =
    `${QR_PREFIX}${order.qrCode}`;

  return (
    <View className="flex-1 bg-background">

      {/* =====================================
          BACKGROUND
      ====================================== */}

      <ImageBackground
        source={
          patternBackground
        }
        resizeMode="cover"
        className="absolute inset-0"
        imageStyle={{
          opacity: 0.08,
        }}
      />

      {/* =====================================
          HEADER
      ====================================== */}

      <Header
        title={`Commande #${
          order.orderNumber ??
          order.id
        }`}
        onBackPress={() =>
          navigation.goBack()
        }
      />

      <ScrollView
        contentContainerClassName="gap-4 p-4 pb-8"
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* =====================================
            JOSEF
        ====================================== */}

        <View className="items-center">

          <Image
            source={josef}
            resizeMode="contain"
            className="h-32 w-32"
          />

          <View className="-mt-2 rounded-2xl bg-white px-4 py-2">

            <Text className="text-center font-sans-semibold text-sm text-primary">
              {isDeclined
                ? 'Oh non...'
                : order.status ===
                    'COLLECTED'
                  ? 'À bientôt !'
                  : 'Votre commande'}
            </Text>

          </View>
        </View>

        {/* =====================================
            STATUS
        ====================================== */}

        <View className="items-center gap-2 rounded-2xl border border-border bg-white p-6">

          <View
            className={`h-14 w-14 items-center justify-center rounded-full ${
              isDeclined
                ? 'bg-pink/15'
                : 'bg-green/15'
            }`}
          >

            <Ionicons
              name={
                isDeclined
                  ? 'close'
                  : 'checkmark'
              }
              size={28}
              color={
                isDeclined
                  ? colors.pink
                  : colors.green
              }
            />

          </View>

          <Text className="font-sans-semibold text-lg text-text">
            {
              STATUS_LABELS[
                order.status
              ]
            }
          </Text>

          {isDeclined ? (
            <Text className="text-center font-sans text-sm text-text-secondary">
              Votre commande a
              été refusée.
            </Text>
          ) : (
            <Text className="text-center font-sans text-sm text-text-secondary">
              Votre commande est
              en cours de
              traitement.
            </Text>
          )}

          {order.declineReason ? (
            <Text className="mt-1 text-center font-sans text-sm text-pink">
              Motif :{' '}
              {
                order.declineReason
              }
            </Text>
          ) : null}

        </View>

        {/* =====================================
            QR CODE / TICKET
        ====================================== */}

        {!isDeclined &&
        order.status !==
          'COLLECTED' ? (

          <View className="items-center rounded-2xl border border-border bg-white p-6">

            <Text className="mb-2 font-sans-bold text-lg text-primary">
              Votre ticket
            </Text>

            <Text className="mb-5 text-center font-sans text-xs text-text-secondary">
              Présentez ce QR code
              au comptoir pour
              récupérer votre
              commande.
            </Text>

            <View className="rounded-2xl border border-border bg-white p-3">

              <QRCodeView
                value={
                  qrValue
                }
              />

            </View>

            <Text className="mt-4 font-sans-semibold text-xs text-text-secondary">
              Ticket #
              {
                order.orderNumber
              }
            </Text>

            <Text className="mt-1 text-center font-sans text-[10px] text-text-secondary">
              Code sécurisé :{' '}
              {order.qrCode}
            </Text>

          </View>

        ) : null}

        {/* =====================================
            COLLECTED
        ====================================== */}

        {order.status ===
        'COLLECTED' ? (

          <View className="items-center rounded-2xl border border-border bg-white p-6">

            <View className="h-14 w-14 items-center justify-center rounded-full bg-green/15">

              <Ionicons
                name="checkmark-done"
                size={28}
                color={
                  colors.green
                }
              />

            </View>

            <Text className="mt-3 font-sans-semibold text-lg text-text">
              Commande récupérée
            </Text>

            <Text className="mt-1 text-center font-sans text-sm text-text-secondary">
              Ce ticket a déjà
              été utilisé.
            </Text>

          </View>

        ) : null}

        {/* =====================================
            ORDER DETAILS
        ====================================== */}

        <View className="rounded-2xl border border-border bg-white p-4">

          <Text className="mb-3 font-sans-semibold text-base text-text">
            Détails de la commande
          </Text>

          {order.items.map(
            (
              item,
              index,
            ) => (

              <View
                key={`${item.meal.id}-${index}`}
                className="flex-row justify-between py-1.5"
              >

                <View className="flex-1 pr-3">

                  <Text className="font-sans text-sm text-text">
                    {
                      item.meal.name
                    }
                  </Text>

                  <Text className="font-sans text-xs text-text-secondary">
                    x
                    {
                      item.quantity
                    }
                  </Text>

                </View>

                <Text className="font-sans text-sm text-text">

                  {(
                    Number(
                      item.unitPrice,
                    ) *
                    item.quantity
                  ).toFixed(
                    2,
                  )}{' '}
                  DT

                </Text>

              </View>

            ),
          )}

          <View className="mt-2 flex-row justify-between border-t border-border pt-3">

            <Text className="font-sans-semibold text-sm text-text">
              Total
            </Text>

            <Text className="font-sans-semibold text-sm text-primary">

              {Number(
                order.totalPrice,
              ).toFixed(
                2,
              )}{' '}
              DT

            </Text>

          </View>

          <View className="mt-2 flex-row justify-between">

            <Text className="font-sans text-xs text-text-secondary">
              Paiement
            </Text>

            <Text className="font-sans text-xs text-text-secondary">
              {
                order.paymentMethod
              }
            </Text>

          </View>

        </View>

        {/* =====================================
            TRACKING
        ====================================== */}

        {!isDeclined ? (

          <View className="rounded-2xl border border-border bg-white p-4">

            <Text className="mb-3 font-sans-semibold text-base text-text">
              Suivi de commande
            </Text>

            {STATUS_STEPS.map(
              (
                step,
                index,
              ) => {

                const isDone =
                  currentStepIndex >=
                    0 &&
                  index <=
                    currentStepIndex;

                const isCurrent =
                  index ===
                  currentStepIndex;

                return (

                  <View
                    key={
                      step.key
                    }
                    className="flex-row items-center gap-3 py-2"
                  >

                    <View
                      className={`h-4 w-4 items-center justify-center rounded-full ${
                        isDone
                          ? 'bg-secondary'
                          : 'bg-border'
                      }`}
                    >

                      {isDone ? (
                        <Ionicons
                          name="checkmark"
                          size={10}
                          color="white"
                        />
                      ) : null}

                    </View>

                    <Text
                      className={`font-sans text-sm ${
                        isCurrent ||
                        isDone
                          ? 'text-text'
                          : 'text-text-secondary'
                      }`}
                    >
                      {
                        step.label
                      }
                    </Text>

                  </View>

                );
              },
            )}

          </View>

        ) : null}

        {/* =====================================
            INFORMATION
        ====================================== */}

        <View className="rounded-2xl border border-border bg-white p-4">

          <Text className="mb-2 font-sans-semibold text-base text-text">
            Informations
          </Text>

          <View className="flex-row justify-between py-1">

            <Text className="font-sans text-xs text-text-secondary">
              Commande créée
            </Text>

            <Text className="font-sans text-xs text-text">

              {new Date(
                order.createdAt,
              ).toLocaleDateString(
                'fr-FR',
              )}

            </Text>

          </View>

          <View className="flex-row justify-between py-1">

            <Text className="font-sans text-xs text-text-secondary">
              Dernière mise à jour
            </Text>

            <Text className="font-sans text-xs text-text">

              {new Date(
                order.updatedAt,
              ).toLocaleDateString(
                'fr-FR',
              )}

            </Text>

          </View>

        </View>

      </ScrollView>
    </View>
  );
}