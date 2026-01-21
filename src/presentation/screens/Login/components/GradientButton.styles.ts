import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  shadowWrap: {
    width: '100%',
    maxWidth: 520,

    // Sombra “profunda” tipo botón grande
    shadowColor: '#08326d',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
    marginTop: 10,
  },

  pressable: {
    borderRadius: 22,
    overflow: 'hidden',
  },

  gradient: {
    height: 72,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },

  text: {
    color: '#fbfbfb',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0.2,
  },

  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },

  disabled: {
    opacity: 0.6,
  },
});
