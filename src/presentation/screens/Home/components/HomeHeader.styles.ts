import { StyleSheet } from 'react-native';

/**
 * ✅ Estilos del HomeHeader
 * - Header delgado
 * - Botones con fondo sutil (look profesional)
 */
export const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2E6EA7',
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },

  avatarWrap: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#BFD7EF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontWeight: '800',
    color: '#1B4E7A',
  },

  onlineDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1DB954',
    borderWidth: 2,
    borderColor: '#2E6EA7',
    bottom: -2,
    right: -2,
  },

  searchBox: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.20)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    paddingVertical: 0,
    fontSize: 14,
  },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',

    // ✅ look corporativo pro
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});
