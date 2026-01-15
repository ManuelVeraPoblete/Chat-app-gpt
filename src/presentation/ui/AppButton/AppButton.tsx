import React from 'react';
import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import { styles } from './AppButton.styles';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

/**
 * Botón reutilizable.
 * SRP: solo UI, sin lógica de negocio.
 */
export function AppButton({ title, onPress, disabled, loading }: Props) {
  const isDisabled = !!disabled || !!loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.content}>
        {loading ? <ActivityIndicator /> : <Text style={styles.text}>{title}</Text>}
      </View>
    </Pressable>
  );
}
