import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useSceneStore } from '../three/store';

type Options = {
  ref: RefObject<HTMLElement | null>;
  chapterId: number;
  enabled?: boolean;
  /** Si es el último capítulo, no aplica fade-in/out: el contenido siempre
   *  está al 100% de opacidad. Solo activa el chapter cuando es visible. */
  final?: boolean;
};

/**
 * Coreografía por capítulo basada en `position: sticky` (CSS) +
 * boundingClientRect leído cada frame:
 *
 * - El contenedor `<section>` tiene altura explícita en vh; dentro tiene
 *   un `[data-chapter-content]` con `position: sticky; top: 0; height: 100vh`.
 * - Mientras la section cruza el viewport, computamos progreso local 0..1
 *   y mutamos opacity/blur/scale del contenido inline (sin GSAP timeline,
 *   sin pin de ScrollTrigger).
 * - El capítulo 0 (hero) ya está visible al cargar — solo morph out.
 */
export function useChapterScroll({
  ref,
  chapterId,
  enabled = true,
  final = false,
}: Options) {
  useEffect(() => {
    if (!ref.current || !enabled) return;
    const section = ref.current;

    const findContent = () =>
      (section.querySelector('[data-chapter-content]') as HTMLElement | null) ??
      (section.firstElementChild?.firstElementChild as HTMLElement | null);

    const isFirst = chapterId === 0;
    let raf = 0;

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = section.offsetHeight - vh;
      const scrolled = -rect.top;
      const p = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0;

      const content = findContent();
      if (content) {
        if (final) {
          // Última sección: contenido siempre visible, sin fade.
          content.style.opacity = '1';
          content.style.filter = 'blur(0px) brightness(1)';
          content.style.transform = 'scale(1)';
        } else {
          let opacity = 1;
          let blur = 0;
          let scale = 1;
          if (p < 0.18 && !isFirst) {
            const k = p / 0.18;
            opacity = k;
            blur = (1 - k) * 18;
            scale = 1 + (1 - k) * 0.06;
          } else if (p > 0.82) {
            const k = (p - 0.82) / 0.18;
            opacity = 1 - k;
            blur = k * 18;
            scale = 1 - k * 0.06;
          }
          content.style.opacity = String(opacity);
          content.style.filter = `blur(${blur.toFixed(2)}px) brightness(${(
            1 + (1 - opacity) * 0.5
          ).toFixed(3)})`;
          content.style.transform = `scale(${scale.toFixed(4)})`;
        }
      }

      // Activación del capítulo
      if (final) {
        // Visible cuando al menos un 30% del viewport lo cubre
        const visible = rect.top < vh * 0.7 && rect.bottom > vh * 0.3;
        if (visible) {
          const current = useSceneStore.getState().chapter;
          if (current !== chapterId) {
            useSceneStore.getState().setChapter(chapterId);
          }
        }
      } else if (p > 0.3 && p < 0.7) {
        const current = useSceneStore.getState().chapter;
        if (current !== chapterId) {
          useSceneStore.getState().setChapter(chapterId);
        }
      }

      // chapterProgress para consumidores que lo necesiten (legacy)
      useSceneStore.getState().setChapterProgress(p);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ref, chapterId, enabled, final]);
}
