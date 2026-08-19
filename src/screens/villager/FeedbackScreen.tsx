import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useState } from 'react';

import {
  useMyFeedback,
  useSubmitFeedback,
  useUpdateFeedback,
} from '@/hooks/useFeedback';
import { colors } from '@/constants/colors';

export default function FeedbackScreen() {
  const {
    data: existingFeedback,
    isLoading: isLoadingFeedback,
  } = useMyFeedback();

  const submitFeedback = useSubmitFeedback();
  const updateFeedback = useUpdateFeedback();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  /*
   * Populate the form when the user's existing feedback
   * is loaded.
   */
  const [initialized, setInitialized] = useState(false);

  if (
    existingFeedback &&
    !initialized
  ) {
    setRating(existingFeedback.rating);
    setComment(existingFeedback.comment ?? '');
    setInitialized(true);
  }

  const isEditing = Boolean(existingFeedback);

  const isSubmitting =
    submitFeedback.isPending ||
    updateFeedback.isPending;

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert(
        'Votre avis',
        'Veuillez sélectionner une note entre 1 et 5 étoiles.',
      );
      return;
    }

    const payload = {
      rating,
      ...(comment.trim()
        ? { comment: comment.trim() }
        : {}),
    };

    const mutation = isEditing
      ? updateFeedback
      : submitFeedback;

    mutation.mutate(payload, {
      onSuccess: () => {
        Alert.alert(
          'Merci ! ❤️',
          'Votre avis a bien été enregistré.',
        );
      },
      onError: () => {
        Alert.alert(
          'Une erreur est survenue',
          'Impossible d’enregistrer votre avis. Veuillez réessayer.',
        );
      },
    });
  };

  if (isLoadingFeedback) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text className="mt-3 font-sans text-sm text-text-secondary">
          Chargement...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* =========================
            HEADER
        ========================== */}
        <View className="px-5 pb-4 pt-14">
          <Text className="font-sans-bold text-2xl text-primary">
            Votre avis
          </Text>

          <Text className="mt-2 font-sans text-sm leading-5 text-text-secondary">
            Votre expérience compte pour nous.
            Dites-nous ce que vous pensez de CoChef.
          </Text>
        </View>

        {/* =========================
            RATING CARD
        ========================== */}
        <View className="mx-4 rounded-3xl bg-white p-6">
          <View className="items-center">
            <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-orange/10">
              <Ionicons
                name="star"
                size={25}
                color={colors.orange}
              />
            </View>

            <Text className="font-sans-bold text-lg text-primary">
              Comment évaluez-vous votre expérience ?
            </Text>

            <Text className="mt-1 text-center font-sans text-xs text-text-secondary">
              Appuyez sur une étoile pour donner votre note
            </Text>
          </View>

          {/* =========================
              STARS
          ========================== */}
          <View className="mt-6 flex-row justify-center">
            {[1, 2, 3, 4, 5].map((star) => {
              const selected = star <= rating;

              return (
                <Pressable
                  key={star}
                  onPress={() => setRating(star)}
                  className="mx-2"
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`${star} étoile${
                    star > 1 ? 's' : ''
                  }`}
                >
                  <Ionicons
                    name={
                      selected
                        ? 'star'
                        : 'star-outline'
                    }
                    size={38}
                    color={
                      selected
                        ? colors.orange
                        : '#D1D5DB'
                    }
                  />
                </Pressable>
              );
            })}
          </View>

          {/* Rating label */}
          <Text className="mt-3 text-center font-sans-semibold text-sm text-primary">
            {rating === 0
              ? 'Choisissez une note'
              : rating === 1
                ? 'Très décevant'
                : rating === 2
                  ? 'Décevant'
                  : rating === 3
                    ? 'Correct'
                    : rating === 4
                      ? 'Très bien'
                      : 'Excellent ! ❤️'}
          </Text>
        </View>

        {/* =========================
            COMMENT
        ========================== */}
        <View className="mx-4 mt-4 rounded-3xl bg-white p-5">
          <Text className="font-sans-bold text-base text-primary">
            Votre commentaire
          </Text>

          <Text className="mt-1 font-sans text-xs text-text-secondary">
            Facultatif — partagez-nous votre expérience.
          </Text>

          <TextInput
            value={comment}
            onChangeText={setComment}
            multiline
            maxLength={500}
            placeholder="Dites-nous ce que vous pensez de CoChef..."
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
            className="mt-4 min-h-[140px] rounded-2xl bg-background px-4 py-4 font-sans text-sm text-primary"
          />

          <Text className="mt-2 text-right font-sans text-[10px] text-text-secondary">
            {comment.length}/500
          </Text>
        </View>

        {/* =========================
            SUBMIT
        ========================== */}
        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          className="mx-4 mt-5 overflow-hidden rounded-2xl bg-primary"
          style={{
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          <View className="h-14 flex-row items-center justify-center">
            {isSubmitting ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <>
                <Ionicons
                  name="send-outline"
                  size={18}
                  color="#FFFFFF"
                />

                <Text className="ml-2 font-sans-bold text-sm text-white">
                  {isEditing
                    ? 'Modifier mon avis'
                    : 'Envoyer mon avis'}
                </Text>
              </>
            )}
          </View>
        </Pressable>

        {/* =========================
            THANK YOU
        ========================== */}
        <View className="mx-8 mt-6 items-center">
          <Text className="text-center font-sans text-xs leading-5 text-text-secondary">
            Merci de nous aider à améliorer CoChef
            pour toute la communauté. ❤️
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}