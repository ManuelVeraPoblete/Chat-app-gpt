import { StyleSheet } from 'react-native';

/**
 * ✅ ChatScreen styles (WhatsApp-like PRO)
 * Incluye:
 * ✅ Fondo con patrón (dots)
 * ✅ Burbuja con colita suave
 * ✅ Hora dentro de burbuja
 * ✅ Checks (✅✅) para mensajes enviados
 * ✅ Input absoluto (se sube con el teclado)
 */
export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#d9ecff',
  },

  // ✅ Header
  header: {
    backgroundColor: '#2b69a6',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },

  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },

  headerTitleWrap: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  headerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ✅ Body
  chatBody: {
    flex: 1,
    backgroundColor: '#d9ecff',
    position: 'relative', // ✅ requerido para input absoluto
  },

  container: {
    flex: 1,
  },

  // ✅ Patrón
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.16,
  },

  patternDot: {
    width: 10,
    height: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#f6f7f9',
  },

  // ✅ Lista (inverted)
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 14,
  },

  // ✅ Mensajes
  messageRow: {
    width: '100%',
    marginVertical: 6,
  },

  messageLeft: {
    alignItems: 'flex-start',
  },

  messageRight: {
    alignItems: 'flex-end',
  },

  messageStack: {
    maxWidth: '82%',
  },

  stackLeft: {
    alignItems: 'flex-start',
  },

  stackRight: {
    alignItems: 'flex-end',
  },

  bubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: 'relative',
    overflow: 'visible',
  },

  bubbleOther: {
    backgroundColor: '#ffffff',
  },

  bubbleMe: {
    backgroundColor: '#3b6793',
  },

  messageText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },

  messageTextOther: {
    color: '#1c2b3a',
  },

  messageTextMe: {
    color: '#ffffff',
  },

  bubbleFooter: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-end',
  },

  timeInBubble: {
    fontSize: 12,
    fontWeight: '700',
  },

  timeInBubbleOther: {
    color: 'rgba(28,43,58,0.55)',
  },

  timeInBubbleMe: {
    color: 'rgba(255,255,255,0.85)',
  },

  checkIconMe: {
    marginLeft: 2,
  },

  // ✅ Colitas
  tailBaseLeft: {
    position: 'absolute',
    left: -6,
    bottom: 10,
    width: 12,
    height: 12,
    backgroundColor: '#ffffff',
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
  },

  tailCutLeft: {
    position: 'absolute',
    left: -10,
    bottom: 10,
    width: 12,
    height: 12,
    backgroundColor: '#d9ecff',
    borderRadius: 6,
  },

  tailBaseRight: {
    position: 'absolute',
    right: -6,
    bottom: 10,
    width: 12,
    height: 12,
    backgroundColor: '#31669a',
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
  },

  tailCutRight: {
    position: 'absolute',
    right: -10,
    bottom: 10,
    width: 12,
    height: 12,
    backgroundColor: '#d9ecff',
    borderRadius: 6,
  },

  // ✅ Input absoluto (se mueve con teclado)
  inputBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#cfe6ff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: '#fcfcfc',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#0b2b52',
    fontSize: 15,
    fontWeight: '600',
  },

  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2b69a6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  sendBtnDisabled: {
    opacity: 0.5,
  },
});
