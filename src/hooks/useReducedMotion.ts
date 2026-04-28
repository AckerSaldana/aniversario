import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqMobile = window.matchMedia('(max-width: 768px)');

    const update = () => {
      setReduced(mqMotion.matches);
      setIsMobile(mqMobile.matches);
    };
    update();

    mqMotion.addEventListener('change', update);
    mqMobile.addEventListener('change', update);
    return () => {
      mqMotion.removeEventListener('change', update);
      mqMobile.removeEventListener('change', update);
    };
  }, []);

  return { reduced, isMobile, lowFi: reduced || isMobile };
}
