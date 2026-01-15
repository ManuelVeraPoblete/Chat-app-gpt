import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 520,
  },

  blur: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },

  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },

  leftIcon: {
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    flex: 1,
    color: 'rgba(255,255,255,0.95)',
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 0,
  },

  rightIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightIconPlaceholder: {
    width: 34,
  },
});
