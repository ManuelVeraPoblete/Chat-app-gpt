import { StyleSheet } from 'react-native';

/**
 * ✅ Estilos del LoginScreen (idéntico a la imagen)
 * - Overlay azul corporativo
 * - Título grande centrado
 * - Labels en blanco
 * - Inputs alineados
 * - Link "Forgot Password?" a la derecha
 * - Botón grande separado del formulario
 */
export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0b2f5a', // ✅ fallback mientras carga la imagen
  },

  bg: {
    flex: 1,
  },

  /**
   * ✅ Overlay azul suave (como el mock)
   * Ajusta alpha si tu background se ve muy oscuro o muy claro.
   */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 86, 170, 0.55)',
  },

  keyboard: {
    flex: 1,
  },

  /**
   * ✅ Layout general
   * - Header arriba
   * - Form debajo
   */
  container: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 14,
    paddingBottom: 40,
  },

  /**
   * ✅ Header centrado
   */
  header: {
    alignItems: 'center',
    marginTop: 10,
  },

  logoWrap: {
    alignItems: 'center',
    marginBottom: 14,
    transform: [{ scale: 1.08 }], // ✅ leve aumento visual del ícono
  },

  title: {
    fontSize: 46,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.3,
  },

  /**
   * ✅ Form
   */
  form: {
    marginTop: 38,
  },

  label: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },

  labelSpacingTop: {
    marginTop: 22,
  },

  /**
   * ✅ Envoltura para asegurar ancho consistente
   */
  fieldWrap: {
    width: '100%',
  },

  /**
   * ✅ Forgot Password
   */
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginBottom: 24,
    paddingVertical: 4,
  },

  forgotText: {
    color: 'rgba(230,245,255,0.95)',
    fontSize: 16,
    fontWeight: '600',
  },

  /**
   * ✅ Botón grande (centrado)
   */
  buttonWrap: {
    marginTop: 6,
    alignItems: 'center',
  },
});
