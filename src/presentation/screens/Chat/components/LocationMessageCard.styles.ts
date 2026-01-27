import { StyleSheet } from 'react-native';

/**
 * ✅ Tarjeta de ubicación estilo WhatsApp
 * - Mini mapa + pin
 * - Botón abrir en maps
 */
export const styles = StyleSheet.create({
  card: {
    width: 260,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: 8,
  },

  map: {
    width: '100%',
    height: 120,
    backgroundColor: '#e9eef5',
  },

  footer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  footerLeft: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    color: '#0b2b52',
    fontSize: 13,
    fontWeight: '900',
  },

  subtitle: {
    marginTop: 2,
    color: 'rgba(11,43,82,0.75)',
    fontSize: 12,
    fontWeight: '700',
  },

  openBtn: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#2b69a6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  openBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
});
