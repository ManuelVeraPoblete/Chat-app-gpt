import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  outerShadow: {
    // Sombra suave como la imagen
    shadowColor: '#0b3a7a',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },

  outer: {
    width: 128,
    height: 108,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: 8,
    position: 'relative',
  },

  inner: {
    flex: 1,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dotsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },

  // Tail (colita del globo)
  tailOuter: {
    position: 'absolute',
    left: 22,
    bottom: -10,
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    transform: [{ rotate: '45deg' }],
  },

  tailInner: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 16,
    height: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: 'rgba(120,210,255,0.45)',
    opacity: 0.35,
  },
});
