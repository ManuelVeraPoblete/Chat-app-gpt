import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#0f172a',
    backgroundColor: '#0f172a',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  content: {
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});
