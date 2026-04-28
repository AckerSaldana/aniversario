import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RefObject } from 'react';
import { useSceneStore } from '../three/store';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Options = {
  ref: RefObject<HTMLElement | null>;
  chapterId: number;
  pin?: boolean;
  /** longitud del scroll en múltiplos de viewport (1 = 100vh) */
  length?: number;
  onProgress?: (p: number) => void;
  enabled?: boolean;
};

/**
 * Coreografía maestra por capítulo:
 * - El fondo (body + canvas) está pinned globalmente, no cambia.
 * - Cada sección se pinea por `length * 100vh`.
 * - El contenido del capítulo (primer hijo de la <section> o [data-chapter-content])
 *   hace morph in (opacity + blur + brightness + scale) en el primer 22% del pin,
 *   se mantiene en foco durante el medio, y morph out en el último 22%.
 * - El capítulo 0 (hero) ya está visible al cargar — solo hace el morph out.
 *
 * Resultado: la escena nunca "cambia"; solo cambia qué texto está iluminado.
 */
export function useChapterScroll({
  ref,
  chapterId,
  pin = true,
  length = 2,
  onProgress,
  enabled = true,
}: Options) {
  useGSAP(
    () => {
      if (!ref.current || !enabled) return;

      const isFirst = chapterId === 0;

      const content =
        (ref.current.querySelector(
          '[data-chapter-content]'
        ) as HTMLElement | null) ??
        (ref.current.firstElementChild as HTMLElement | null);

      // 1. Pin + actualización del store de escena
      const pinTrigger = ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: `+=${length * 100}%`,
        pin,
        pinSpacing: pin,
        scrub: 1.2,
        invalidateOnRefresh: true,
        onEnter: () => useSceneStore.getState().setChapter(chapterId),
        onEnterBack: () => useSceneStore.getState().setChapter(chapterId),
        onUpdate: (self) => {
          useSceneStore.getState().setChapterProgress(self.progress);
          onProgress?.(self.progress);
        },
      });

      // 2. Morph del contenido scrubbed sobre el mismo rango del pin
      let morphTl: gsap.core.Timeline | null = null;
      if (content) {
        morphTl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: `+=${length * 100}%`,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // Fade in (0 → 0.22 del rango), solo si no es el hero
        if (!isFirst) {
          morphTl.fromTo(
            content,
            {
              opacity: 0,
              scale: 1.06,
              filter: 'blur(18px) brightness(1.5)',
            },
            {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px) brightness(1)',
              ease: 'none',
              duration: 0.22,
            },
            0
          );
        }

        // Fade out (0.78 → 1) — siempre
        morphTl.to(
          content,
          {
            opacity: 0,
            scale: 0.94,
            filter: 'blur(18px) brightness(1.6)',
            ease: 'none',
            duration: 0.22,
          },
          0.78
        );
      }

      return () => {
        pinTrigger.kill();
        morphTl?.scrollTrigger?.kill();
        morphTl?.kill();
      };
    },
    { scope: ref, dependencies: [chapterId, enabled, pin, length] }
  );
}
