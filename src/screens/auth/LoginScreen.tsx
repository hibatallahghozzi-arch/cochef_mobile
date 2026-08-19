import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Logo from '@/components/common/Logo';
import { useAuth } from '@/contexts/AuthContext';
import type { RootStackParamList } from '@/navigation/types';
import {
  loginSchema,
  type LoginFormValues,
} from '@/utils/authSchemas';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login, isSubmitting } = useAuth();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      await login({
        email: values.email.trim(),
        password: values.password,
      });
    } catch (error: any) {
      console.log('LOGIN SCREEN ERROR:', error);

      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 401) {
        setServerError('Email ou mot de passe incorrect.');
      } else if (status === 400) {
        setServerError(
          Array.isArray(message)
            ? message.join('\n')
            : message || 'Données invalides.',
        );
      } else if (!error?.response) {
        setServerError(
          'Impossible de contacter le serveur. Vérifiez que le backend est lancé et que votre téléphone est sur le même Wi-Fi.',
        );
      } else {
        setServerError(
          message || 'Une erreur est survenue. Veuillez réessayer.',
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View className="mb-10 items-center">
          <Logo size="md" />

          <Text className="mt-3 font-sans-semibold text-lg text-text">
            Connexion
          </Text>

          <Text className="mt-1 text-center font-sans text-sm text-text-secondary">
            Connectez-vous à votre compte CoChef
          </Text>
        </View>

        {/* FORM */}
        <View className="gap-4">
          {/* EMAIL */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="Entrez votre email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isSubmitting}
                error={errors.email?.message}
              />
            )}
          />

          {/* PASSWORD */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Mot de passe"
                placeholder="Entrez votre mot de passe"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isSubmitting}
                error={errors.password?.message}
              />
            )}
          />

          {/* SERVER ERROR */}
          {serverError ? (
            <View className="rounded-xl bg-pink/10 px-4 py-3">
              <Text className="text-center font-sans text-sm text-pink">
                {serverError}
              </Text>
            </View>
          ) : null}

          {/* LOGIN BUTTON */}
          <View className="mt-2">
            <Button
              label="Se connecter"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
            />
          </View>

          {/* REGISTER */}
          <Button
            label="Pas encore de compte ? Inscrivez-vous"
            variant="secondary"
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}