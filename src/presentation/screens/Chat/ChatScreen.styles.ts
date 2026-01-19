import { StyleSheet } from 'react-native';

/**
 * ✅ Estilos del ChatScreen (separado del TSX)
 * - Header azul suave
 * - Botones azules
 * - Fondo celeste suave
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

  // ✅ Header delgado (SIN height dinámico)
  header: {
    backgroundColor: '#2b69a6',
    paddingHorizontal: 10,
    paddingVertical: 8, // ✅ ESTE ES EL CAMBIO IMPORTANTE (lo hace fino)
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#0b2b52',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, // ✅ menos sombra vertical
    elevation: 6,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  iconBtn: {
    width: 34, // ✅ un poco más chico
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleWrap: {
    flex: 1,
  },

  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },

  messagesList: {
    flex: 1,
  },

  messagesContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },

  // ✅ Burbuja
  messageRow: {
    flexDirection: 'row',
    maxWidth: '85%',
  },

  messageLeft: {
    alignSelf: 'flex-start',
  },

  messageRight: {
    alignSelf: 'flex-end',
  },

  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
  },

  bubbleOther: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  bubbleMe: {
    backgroundColor: '#cfe7ff',
    borderTopRightRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  messageText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    color: '#1c2b2b',
  },

  // ✅ Input
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#d9ecff',
  },

  inputCard: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    paddingTop: 6,
    paddingBottom: 6,
  },

  smallIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ✅ Botón enviar/mic
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2b69a6',

    shadowColor: '#0b2b52',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  // ✅ Placeholder cuando no hay mensajes
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(20, 70, 120, 0.55)',
    textAlign: 'center',
  },
});
