import { StyleSheet } from 'react-native';

/**
 * ✅ ChatScreen styles (WhatsApp-like PRO)
 * Incluye:
 * ✅ Fondo con patrón (dots)
 * ✅ Burbuja con colita suave
 * ✅ Hora dentro de burbuja
 * ✅ Checks (✅✅) para mensajes enviados
 */
export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#d9ecff',
  },

  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  /**
   * ✅ Header delgado y estable
   */
  header: {
    width: '100%',
    backgroundColor: '#2b69a6',
    shadowColor: '#0b2b52',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  headerContent: {
    height: 46,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },

  backBtn: {
    width: 34,
    height: 34,
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
    justifyContent: 'center',
    marginLeft: 8,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },

  headerSubtitle: {
    color: '#d7e9ff',
    fontSize: 11,
    flexShrink: 1,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
  },

  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },

  /**
   * ✅ Body del chat (fondo + patrón)
   */
  chatBody: {
    flex: 1,
    backgroundColor: '#d9ecff',
  },

  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.18,
    padding: 8,
  },

  patternDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    margin: 10,
  },

  /**
   * ✅ Lista mensajes
   */
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: 8,
  },

  /**
   * ✅ Row de mensaje
   */
  messageRow: {
    marginVertical: 6,
    flexDirection: 'row',
  },

  messageLeft: {
    justifyContent: 'flex-start',
  },

  messageRight: {
    justifyContent: 'flex-end',
  },

  messageStack: {
    maxWidth: '82%',
    minWidth: 60,
  },

  stackLeft: {
    alignItems: 'flex-start',
  },

  stackRight: {
    alignItems: 'flex-end',
  },

  /**
   * ✅ Burbuja
   */
  bubble: {
    position: 'relative',
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 6,
    borderRadius: 14,
  },

  bubbleMe: {
    backgroundColor: '#2b69a6',
  },

  bubbleOther: {
    backgroundColor: '#ffffff',
  },

  /**
   * ✅ Colita suave (usamos un cuadradito rotado + un "corte" redondo)
   * Esto da un efecto curvo muy parecido a WhatsApp.
   */
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

  tailBaseRight: {
    position: 'absolute',
    right: -6,
    bottom: 10,
    width: 12,
    height: 12,
    backgroundColor: '#2b69a6',
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
  },

  /**
   * ✅ "Corte" para suavizar la colita (simula curva)
   * Color igual al fondo del chat.
   */
  tailCutLeft: {
    position: 'absolute',
    left: -2,
    bottom: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#d9ecff',
  },

  tailCutRight: {
    position: 'absolute',
    right: -2,
    bottom: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#d9ecff',
  },

  /**
   * ✅ Texto del mensaje
   */
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },

  messageTextMe: {
    color: '#ffffff',
  },

  messageTextOther: {
    color: '#0b2b52',
  },

  /**
   * ✅ Footer dentro de la burbuja (hora + checks)
   */
  bubbleFooter: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 6,
  },

  timeInBubble: {
    fontSize: 11,
    opacity: 0.85,
  },

  timeInBubbleMe: {
    color: 'rgba(255,255,255,0.85)',
  },

  timeInBubbleOther: {
    color: 'rgba(11,43,82,0.55)',
  },

  checkIconMe: {
    opacity: 0.9,
  },

  /**
   * ✅ Input bar
   */
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#cfe6ff',
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    fontSize: 14,
    color: '#0b2b52',
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
