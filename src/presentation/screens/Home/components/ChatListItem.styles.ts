import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#cfe3f8',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(35, 94, 150, 0.18)',
  },

  textCol: {
    flex: 1,
    gap: 6,
  },

  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  name: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#0c3f78',
  },

  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  time: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(20, 70, 120, 0.55)',
  },

  unreadBadge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d7ef2', // azul corporativo
  },

  unreadText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
  },

  preview: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(20, 70, 120, 0.75)',
  },
});
