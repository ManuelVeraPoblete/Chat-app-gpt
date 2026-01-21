import React, { useMemo, useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './LoginScreen.styles';
import { useAuth } from '../../../state/auth/AuthContext';
import { ChatLogo } from './components/ChatLogo';
import { GlassTextField } from './components/GlassTextField';
import { GradientButton } from './components/GradientButton';

/**
 * ✅ LoginScreen (UI idéntica a la imagen)
 * - Fondo con imagen + overlay azul
 * - Logo + título centrados
 * - Labels "Email" / "Password"
 * - Input blanco con ícono izquierdo y ojo en password
 * - "Forgot Password?" alineado a la derecha
 * - Botón grande "Iniciar"
 */
export function LoginScreen() {
  const { login } = useAuth();

  // ✅ Valores por defecto para pruebas (puedes dejarlos vacíos si quieres)
  const [email, setEmail] = useState('user1@empresa.cl');
  const [password, setPassword] = useState('123456');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [loading, setLoading] = useState(false);

  /**
   * ✅ Evitamos llamados inválidos y doble submit
   */
  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !loading;
  }, [email, password, loading]);

  /**
   * ✅ Login usando AuthContext (SRP / Clean Code)
   */
  const onSubmit = async () => {
    if (!canSubmit) return;

    try {
      setLoading(true);
      await login(email.trim(), password.trim());
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No fue posible iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ Acción placeholder para "Forgot Password?"
   * (puedes navegar luego a una pantalla real)
   */
  const onForgotPassword = () => {
    Alert.alert('Recuperación de contraseña', 'Funcionalidad pendiente por implementar.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground
        source={require('../../../../assets/background.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* ✅ Overlay azul (look corporativo como la imagen) */}
        <View style={styles.overlay} />

        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.container}>
            {/* ✅ Header: Logo + título */}
            <View style={styles.header}>
              <View style={styles.logoWrap}>
                <ChatLogo />
              </View>

              <Text style={styles.title}>Corp Chat</Text>
            </View>

            {/* ✅ Formulario */}
            <View style={styles.form}>
              {/* Email */}
              <Text style={styles.label}>Email</Text>
              <View style={styles.fieldWrap}>
                <GlassTextField
                  icon="mail-outline"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                />
              </View>

              {/* Password */}
              <Text style={[styles.label, styles.labelSpacingTop]}>Password</Text>
              <View style={styles.fieldWrap}>
                <GlassTextField
                  icon="lock-closed-outline"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={isPasswordHidden}
                  autoCapitalize="none"
                  rightIcon={isPasswordHidden ? 'eye-outline' : 'eye-off-outline'}
                  onRightIconPress={() => setIsPasswordHidden((v) => !v)}
                  returnKeyType="done"
                  onSubmitEditing={onSubmit}
                />
              </View>

              {/* ✅ Forgot Password alineado a la derecha */}
              <Pressable onPress={onForgotPassword} style={styles.forgotWrap}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>

              {/* ✅ Botón "Iniciar" grande */}
              <View style={styles.buttonWrap}>
                <GradientButton
                  title="Iniciar"
                  onPress={onSubmit}
                  disabled={!canSubmit}
                  loading={loading}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}
