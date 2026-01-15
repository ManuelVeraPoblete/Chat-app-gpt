import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './GradientButton.styles';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

/**
 * Botón con gradiente + sombra (como tu imagen).
 */
export function GradientButton({ title, onPress, disabled, loading }: Props) {
  const isDisabled = !!disabled || !!loading;

  return (
    <View style={styles.shadowWrap}>
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.pressable,
          pressed && !isDisabled && styles.pressed,
          isDisabled && styles.disabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <LinearGradient
          colors={['#67d6ff', '#1e79ff']}
          start={{ x: 0.2, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.text}>{title}</Text>
          )}
        </LinearGradient>
      </Pressable>
    </View>
  );
}
