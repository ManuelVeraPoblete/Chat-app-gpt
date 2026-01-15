import { StyleSheet } from 'react-native';

/**
 * Estilos para fondo con imagen + overlay + layout centrado.
 */
export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000', // fallback mientras carga la imagen
  },

  bg: {
    flex: 1,
  },

  /**
   * Overlay para asegurar que los inputs glass y textos se lean bien.
   * Ajusta opacity si tu imagen es más oscura o más clara.
   */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 60, 140, 0.18)',
  },

  keyboard: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 26,
  },

  logoWrap: {
    alignItems: 'center',
    marginBottom: 6,
  },

  form: {
    gap: 16,
    alignItems: 'center',
  },

  // “Light streaks” decorativos (opcional)
  streak: {
    position: 'absolute',
    width: 2,
    height: 240,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 2,
    opacity: 0.35,
  },
  streak1: {
    top: 40,
    left: 40,
    transform: [{ rotate: '35deg' }],
  },
  streak2: {
    top: 80,
    right: 25,
    height: 290,
    opacity: 0.25,
    transform: [{ rotate: '35deg' }],
  },
  streak3: {
    bottom: 40,
    right: 60,
    height: 220,
    opacity: 0.18,
    transform: [{ rotate: '35deg' }],
  },
});
