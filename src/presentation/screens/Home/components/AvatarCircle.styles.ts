import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#0b2b52',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  initials: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0c3f78',
  },

  badgeOnline: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#cfe3f8',
  },

  badgeAi: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#60a5fa',
    borderWidth: 2,
    borderColor: '#cfe3f8',
  },

  // ✅ Badge para "YO"
  badgeMe: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fbbf24',
    borderWidth: 2,
    borderColor: '#cfe3f8',
  },
});
