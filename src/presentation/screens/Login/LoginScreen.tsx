import React, { useMemo, useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';
import { styles } from './LoginScreen.styles';
import { useAuth } from '../../../state/auth/AuthContext';
import { ChatLogo } from './components/ChatLogo';
import { GlassTextField } from './components/GlassTextField';
import { GradientButton } from './components/GradientButton';

/**
 * Login UI:
 * - Fondo con imagen (assets/background.png)
 * - UI encima con overlay para legibilidad
 * - Lógica delegada a AuthContext (Clean / SRP)
 */
export function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState('user1@empresa.cl');
  const [password, setPassword] = useState('123456');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !loading;
  }, [email, password, loading]);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await login(email, password);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No fue posible iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Fondo con imagen local */}
      <ImageBackground
        source={require('../../../../assets/background.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* Overlay para mejorar contraste/legibilidad (se puede ajustar opacidad) */}
        <View style={styles.overlay} />

        {/* Si quieres conservar los “streaks” como en la imagen original */}
        <View style={[styles.streak, styles.streak1]} />
        <View style={[styles.streak, styles.streak2]} />
        <View style={[styles.streak, styles.streak3]} />

        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.content}>
            <View style={styles.logoWrap}>
              <ChatLogo />
            </View>

            <View style={styles.form}>
              <GlassTextField
                icon="mail-outline"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />

              <GlassTextField
                icon="lock-closed-outline"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={isPasswordHidden}
                autoCapitalize="none"
                rightIcon={isPasswordHidden ? 'eye-outline' : 'eye-off-outline'}
                onRightIconPress={() => setIsPasswordHidden((v) => !v)}
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />

              <GradientButton
                title="Login"
                onPress={onSubmit}
                disabled={!canSubmit}
                loading={loading}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}
