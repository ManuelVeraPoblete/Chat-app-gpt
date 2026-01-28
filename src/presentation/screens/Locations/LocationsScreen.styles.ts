// src/presentation/screens/Locations/LocationsScreen.styles.ts

import { StyleSheet } from 'react-native';

/**
 * ✅ Estilos profesionales para LocationsScreen
 * - Marcadores: avatar circular o iniciales (fallback tipo chat)
 */
export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#d9ecff',
  },

  header: {
    backgroundColor: '#2b69a6',
    paddingHorizontal: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitleWrap: {
    flex: 1,
    minWidth: 0,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },

  headerSub: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '700',
  },

  mapWrap: {
    flex: 1,
    backgroundColor: '#d9ecff',
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  statusPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  statusText: {
    flex: 1,
    color: '#0b2b52',
    fontWeight: '800',
    fontSize: 12,
  },

  /**
   * ✅ Marker: avatar
   * - Contenedor circular con sombra
   */
  markerAvatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

    // iOS shadow
    shadowColor: '#0b2b52',
    shadowOpacity: 0.20,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },

    // Android shadow
    elevation: 5,

    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.75)',
  },

  markerAvatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    resizeMode: 'cover',
  },

  /**
   * ✅ Marker: iniciales (fallback tipo chat)
   */
  markerInitialsWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(43,105,166,0.95)', // corporativo azul
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#0b2b52',
    shadowOpacity: 0.20,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,

    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.75)',
  },

  markerInitialsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
