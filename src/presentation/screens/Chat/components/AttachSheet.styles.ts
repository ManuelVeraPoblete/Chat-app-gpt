// src/presentation/screens/Chat/components/AttachSheet.styles.ts
import { StyleSheet } from 'react-native';

/**
 * ✅ Estilos del Bottom Sheet (independientes del ChatScreen)
 * - SRP: evita dependencia con estilos del chat
 * - Diseño PRO: radios suaves, sombra, cards limpias
 */
export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  overlayPressArea: {
    flex: 1,
  },

  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },

  sheetCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',

    // ✅ Sombra iOS
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 },

    // ✅ Elevation Android
    elevation: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0b2b52',
  },

  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f4f8ff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    gap: 14,
    paddingBottom: 14,
  },

  item: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: '#f7fbff',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  itemText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0b2b52',
  },

  cancelBtn: {
    marginTop: 2,
    borderRadius: 14,
    backgroundColor: '#2b69a6',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
});
