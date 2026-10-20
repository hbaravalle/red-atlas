import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// Closing a modal plays its exit animation and leaves the route when the
// overlay's fade-out ends. With reduced motion the animation still runs, in
// 0.01ms (index.scss), so animationend still fires. Escape closes it too
export function useAnimatedClose(to = '/') {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  const close = useCallback(() => setIsClosing(true), []);

  // The children's animations bubble up too; only the overlay's own counts
  const onAnimationEnd = (event: React.AnimationEvent) => {
    if (isClosing && event.target === event.currentTarget) navigate(to);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  return { isClosing, close, onAnimationEnd };
}
