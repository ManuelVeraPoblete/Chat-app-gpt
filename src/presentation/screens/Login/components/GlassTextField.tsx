import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './GlassTextField.styles';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;

  secureTextEntry?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;

  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType?: 'done' | 'next' | 'go' | 'send';
  onSubmitEditing?: () => void;
};

/**
 * Input “glass” con Blur + íconos (como tu imagen).
 */
export function GlassTextField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  rightIcon,
  onRightIconPress,
  keyboardType = 'default',
  autoCapitalize = 'none',
  returnKeyType = 'done',
  onSubmitEditing,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={28} tint="light" style={styles.blur}>
        <View style={styles.row}>
          <View style={styles.leftIcon}>
            <Ionicons name={icon} size={22} color="rgba(255,255,255,0.92)" />
          </View>

          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.78)"
            style={styles.input}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
          />

          {rightIcon ? (
            <Pressable
              onPress={onRightIconPress}
              style={styles.rightIcon}
              accessibilityRole="button"
              accessibilityLabel="Toggle password visibility"
            >
              <Ionicons name={rightIcon} size={22} color="rgba(255,255,255,0.92)" />
            </Pressable>
          ) : (
            <View style={styles.rightIconPlaceholder} />
          )}
        </View>
      </BlurView>
    </View>
  );
}
