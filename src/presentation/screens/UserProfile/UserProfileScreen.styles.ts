import { StyleSheet } from 'react-native';

/**
 * ✅ Estilos perfil usuario (corporativo / limpio)
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9ecff',
  },
  content: {
    padding: 14,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#0b2b52',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0b2b52',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#2b69a6',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0b2b52',
    marginBottom: 10,
  },
  row: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e6f1ff',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2b69a6',
  },
  value: {
    marginTop: 2,
    fontSize: 14,
    color: '#0b2b52',
    fontWeight: '600',
  },
  center: {
    flex: 1,
    backgroundColor: '#d9ecff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  centerText: {
    marginTop: 10,
    fontWeight: '700',
    color: '#0b2b52',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#b00020',
    marginBottom: 6,
  },
  errorText: {
    color: '#b00020',
    textAlign: 'center',
  },
});
