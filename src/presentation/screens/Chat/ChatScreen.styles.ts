import { StyleSheet } from 'react-native';

/**
 * ✅ ChatScreen styles (WhatsApp-like PRO)
 * Incluye:
 * ✅ Fondo con patrón (dots)
 * ✅ Burbuja con colita suave
 * ✅ Hora dentro de burbuja
 * ✅ Checks (✅✅) para mensajes enviados
 * ✅ Input absoluto (se sube con el teclado)
 * ✅ Preview de adjuntos (antes de enviar)
 * ✅ Adjuntos dentro del mensaje (imágenes + archivos)
 * ✅ Modal preview de imagen full-screen
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
    position: 'relative',
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
    maxWidth: '84%',
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

    paddingHorizontal: 10,
    paddingTop: 10,

    backgroundColor: '#cfe6ff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },

  /**
   * ✅ Fila principal del composer:
   * [📎] [input multiline] [send]
   */
  composerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },

  attachBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fcfcfc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
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
  },

  sendBtnDisabled: {
    opacity: 0.5,
  },

  /**
   * ✅ Preview de adjuntos (antes de enviar)
   */
  attachPreviewContainer: {
    width: '100%',
    marginBottom: 8,
  },

  attachPreviewScroll: {
    gap: 10,
    paddingRight: 8,
  },

  attachPreviewItem: {
    width: 90,
    height: 70,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fcfcfc',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    position: 'relative',
  },

  attachPreviewImage: {
    width: '100%',
    height: '100%',
  },

  attachPreviewFile: {
    flex: 1,
    padding: 8,
    gap: 4,
    justifyContent: 'center',
  },

  attachPreviewFileName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0b2b52',
  },

  attachPreviewFileSize: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(11,43,82,0.60)',
  },

  attachRemoveBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * ✅ Adjuntos dentro del mensaje
   */
  msgAttachmentsWrap: {
    marginBottom: 8,
    gap: 10,
  },

  msgImagesRow: {
    flexDirection: 'row',
    gap: 8,
  },

  msgImagePress: {
    width: 74,
    height: 74,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eaf4ff',
  },

  msgImageThumb: {
    width: '100%',
    height: '100%',
  },

  msgImageMoreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  msgImageMoreText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
  },

  msgFilesCol: {
    gap: 8,
  },

  msgFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },

  msgFileMeta: {
    flex: 1,
    minWidth: 0,
  },

  msgFileName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0b2b52',
  },

  msgFileSize: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(11,43,82,0.60)',
    marginTop: 2,
  },

  /**
   * ✅ Modal preview imagen
   */
  imagePreviewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imagePreviewClose: {
    position: 'absolute',
    top: 50,
    right: 18,
    zIndex: 10,
  },

  imagePreviewFull: {
    width: '92%',
    height: '78%',
  },

    /**
   * ✅ AttachSheet (modal inferior estilo WhatsApp)
   */
  attachSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: 14,
  },

  attachSheetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },

  attachSheetTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0b2b52',
  },

  attachSheetRow: {
    flexDirection: 'row',
    gap: 14,
  },

  attachSheetItem: {
    flex: 1,
    backgroundColor: '#f6fbff',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },

  attachSheetIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },

  attachSheetText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0b2b52',
  },

  attachSheetCancel: {
    marginTop: 4,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eaf4ff',
  },

  attachSheetCancelText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#2b69a6',
  },
    /**
   * ✅ Contador de adjuntos (ej: 3/10)
   */
  attachCounterText: {
    marginTop: 6,
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(11,43,82,0.55)',
  },

});
