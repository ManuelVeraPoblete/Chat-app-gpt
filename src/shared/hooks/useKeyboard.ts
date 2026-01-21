import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

/**
 * ✅ useKeyboard()
 * Hook para obtener:
 * - si el teclado está visible
 * - su altura real (px)
 *
 * Solución robusta para Android físico donde a veces KeyboardAvoidingView no funciona.
 */
export function useKeyboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const onShow = (e: KeyboardEvent) => {
      setIsVisible(true);
      setHeight(e.endCoordinates?.height ?? 0);
    };

    const onHide = () => {
      setIsVisible(false);
      setHeight(0);
    };

    const showSub = Keyboard.addListener('keyboardDidShow', onShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return { isVisible, height };
}
