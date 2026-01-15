/**
 * Entidad de dominio User (independiente de frameworks).
 * Solo refleja lo que el backend realmente entrega.
 */
export type User = {
  id: string;
  email: string;
  displayName: string;
};
