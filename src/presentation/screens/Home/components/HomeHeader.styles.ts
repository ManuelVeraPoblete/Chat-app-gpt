import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2b69a6',
    paddingBottom: 12,
    paddingHorizontal: 14,

    // ✅ sombra leve como la imagen
    shadowColor: '#0b2b52',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  searchWrap: {
    flex: 1,
    height: 42,
  },

  searchBlur: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
  },

  searchInput: {
    height: 42,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
