import { StyleSheet } from 'react-native';

/**
 * ✅ Estilos profesionales para LocationsScreen
 * - Diseño corporativo consistente con el resto del proyecto
 * - Estructura clara y mantenible
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

  controls: {
    padding: 12,
    backgroundColor: '#cfe6ff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    gap: 12,
  },

  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  liveLabel: {
    color: '#0b2b52',
    fontWeight: '900',
    fontSize: 12,
  },

  liveChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },

  liveChipActive: {
    backgroundColor: '#2b69a6',
  },

  liveChipText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0b2b52',
  },

  liveChipTextActive: {
    color: '#fff',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },

  primaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#2b69a6',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  primaryBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
  },

  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  secondaryBtnText: {
    color: '#0b2b52',
    fontWeight: '900',
    fontSize: 13,
  },

  dangerBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#c0392b',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  dangerBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
  },

  permBtn: {
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  permBtnText: {
    color: '#0b2b52',
    fontWeight: '900',
    fontSize: 13,
  },
});
