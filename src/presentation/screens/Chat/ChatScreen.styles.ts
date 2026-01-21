import { StyleSheet } from 'react-native';

/**
 * ✅ ChatScreen styles (WhatsApp-like)
 * - Header con altura fija (56px) + SafeArea
 * - Sin desbordes por nombres largos
 * - Botones compactos a la derecha
 */
export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#d9ecff',
  },

  container: {
    flex: 1,
    backgroundColor: '#d9ecff',
  },

  /**
   * ✅ Header wrapper
   * - paddingTop se inyecta desde insets.top en el TSX
   */
  header: {
    width: '100%',
    backgroundColor: '#2b69a6',

    shadowColor: '#0b2b52',
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    elevation: 4,
  },

  /**
   * ✅ Contenido del header con altura fija (56px)
   * - Esto es lo que hace que se vea "tipo WhatsApp"
   */
  headerContent: {
    height: 56,
    paddingHorizontal: 8,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /**
   * ✅ Lado izquierdo: back + perfil
   */
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0, // ✅ clave para permitir encoger con textos largos
    gap: 4,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * ✅ Área clickeable de perfil
   */
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    gap: 10,
    paddingRight: 6,
  },

  headerTitleWrap: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
  },

  headerSubtitle: {
    color: '#d7e9ff',
    fontSize: 12,
    marginTop: 1,
    flexShrink: 1,
  },

  /**
   * ✅ Lado derecho: iconos compactos
   */
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 6,
  },

  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * ✅ Lista mensajes
   */
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  messageRow: {
    marginVertical: 4,
    flexDirection: 'row',
  },

  messageLeft: {
    justifyContent: 'flex-start',
  },

  messageRight: {
    justifyContent: 'flex-end',
  },

  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },

  bubbleMe: {
    backgroundColor: '#2b69a6',
    borderTopRightRadius: 4,
  },

  bubbleOther: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 4,
  },

  messageText: {
    fontSize: 14,
  },

  messageTextMe: {
    color: '#ffffff',
  },

  messageTextOther: {
    color: '#0b2b52',
  },

  /**
   * ✅ Barra input inferior
   */
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#cfe6ff',
    gap: 10,
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
  },

  sendBtnDisabled: {
    opacity: 0.5,
  },
});
