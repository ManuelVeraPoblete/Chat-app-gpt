import { StyleSheet } from 'react-native';

/**
 * ✅ Header del Chat más delgado
 * - Menos padding vertical
 * - Avatar más chico
 * - Tipografías más compactas
 */
export const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2E6EA7',
    flexDirection: 'row',
    alignItems: 'center',

    // ✅ esto controla el grosor del header
    paddingHorizontal: 10,
    paddingVertical: 8, // 👈 antes seguro estaba 14-18

    gap: 10,
  },

  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 12,
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

  textWrap: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 16, // ✅ más chico
    fontWeight: '800',
    color: '#FFFFFF',
  },

  subtitle: {
    marginTop: 1,
    fontSize: 12, // ✅ más chico
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
});
