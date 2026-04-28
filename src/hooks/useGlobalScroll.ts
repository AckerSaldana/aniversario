import { useEffect } from 'react';
import { getLenis } from './useLenis';
import { useSceneStore } from '../three/store';

/**
 * Driver único de globalProgress (0..1). Lee directo de Lenis si está
 * disponible (smooth scroll); si no, cae a window.scrollY.
 *
 * Se ejecuta en rAF — no depende de ningún ScrollTrigger ni de pin
 * spacers, así que el progreso global avanza siempre que el documento
 * tenga altura mayor que el viewport.
 */
export function useGlobalScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) {
      useSceneStore.getState().setGlobalProgress(0);
      return;
    }

    let raf = 0;
    let last = -1;

    const tick = () => {
      let progress = 0;
      const lenis = getLenis();
      if (lenis && typeof lenis.progress === 'number' && lenis.limit > 0) {
        progress = Math.max(0, Math.min(1, lenis.progress));
      } else {
        const max =
          (document.documentElement.scrollHeight || document.body.scrollHeight) -
          window.innerHeight;
        progress = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
      }
      if (progress !== last) {
        useSceneStore.getState().setGlobalProgress(progress);
        last = progress;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [enabled]);
}
