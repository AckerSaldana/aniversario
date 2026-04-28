import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSceneStore } from '../three/store';

gsap.registerPlugin(ScrollTrigger);

/**
 * Driver único de globalProgress (0..1) para todo el documento.
 * Se monta una sola vez en App. Cualquier consumidor de la escena
 * (CosmosBackdrop, Particles, Postprocessing, Star, lights) deriva
 * su estado visual a partir de este valor.
 */
export function useGlobalScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) {
      useSceneStore.getState().setGlobalProgress(0);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        useSceneStore.getState().setGlobalProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [enabled]);
}
