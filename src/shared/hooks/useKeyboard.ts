import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

/**
 * ✅ useKeyboard()
 * - isVisible: teclado visible
 * - height: altura reportada por RN
 * - screenY: posición Y superior del teclado (más confiable en Android)
 */
export function useKeyboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [height, setHeight] = useState(0);
  const [screenY, setScreenY] = useState<number | null>(null);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: KeyboardEvent) => {
      setIsVisible(true);
      setHeight(e.endCoordinates?.height ?? 0);
      setScreenY(e.endCoordinates?.screenY ?? null);
    };

    const onHide = () => {
      setIsVisible(false);
      setHeight(0);
      setScreenY(null);
    };

    const s1 = Keyboard.addListener(showEvent, onShow);
    const s2 = Keyboard.addListener(hideEvent, onHide);

    return () => {
      s1.remove();
      s2.remove();
    };
  }, []);

  return { isVisible, height, screenY };
}
