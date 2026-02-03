// src/presentation/screens/Locations/LocationsScreen.styles.ts

import { StyleSheet } from 'react-native';

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
   * ✅ Marker (flecha + label)
   */
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  markerArrowWrap: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.90)',
    shadowColor: '#0b2b52',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  markerLabelWrap: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#0b2b52',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    maxWidth: 140,
  },

  markerLabelText: {
    color: '#0b2b52',
    fontSize: 12,
    fontWeight: '900',
  },

  /**
   * ✅ Modal
   */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },

  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },

  modalTitle: {
    color: '#0b2b52',
    fontSize: 15,
    fontWeight: '900',
  },

  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,43,82,0.06)',
  },

  modalBody: {
    paddingTop: 12,
    gap: 10,
  },

  modalRow: {
    gap: 4,
  },

  modalLabel: {
    color: 'rgba(11,43,82,0.65)',
    fontSize: 12,
    fontWeight: '800',
  },

  modalValue: {
    color: '#0b2b52',
    fontSize: 14,
    fontWeight: '900',
  },

  /**
   * ✅ Link style (solo teléfono)
   */
  modalValueLink: {
    color: '#0b2b52',
    fontSize: 14,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },

  /**
   * ✅ Fila del teléfono: icono + número
   */
  phoneRowPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  /**
   * ✅ Acciones del modal (Chat)
   */
  modalActions: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },

  chatActionBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2b69a6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  chatActionBtnDisabled: {
    backgroundColor: 'rgba(43,105,166,0.45)',
  },

  chatActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },

  chatActionTextDisabled: {
    color: 'rgba(255,255,255,0.75)',
  },
});
