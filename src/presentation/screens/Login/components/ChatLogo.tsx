import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './ChatLogo.styles';

/**
 * Logo tipo “chat bubble” como la imagen:
 * - Marco blanco redondeado
 * - Interior con gradiente
 * - 3 puntos blancos
 */
export function ChatLogo() {
  return (
    <View style={styles.outerShadow}>
      <View style={styles.outer}>
        <LinearGradient
          colors={['#7fd4ff', '#2e86ff']}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
          style={styles.inner}
        >
          <View style={styles.dotsRow}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </LinearGradient>

        {/* “Colita” del globo */}
        <View style={styles.tailOuter}>
          <View style={styles.tailInner} />
        </View>
      </View>
    </View>
  );
}
