import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { SplitTextLine } from '../components/SplitTextLine';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { copy } from '../data/copy';
import shared from '../styles/chapters/chapter-shared.module.css';

// TODO (Fase B · gsap-storyteller): coreografía pinned con
// - niebla densa entrando
// - partículas formando el toponímico "Vichy" via custom buffer attribute
// - polaroid 3D entrante (PhotoPlane) registrada en el store
export function Chapter01Vichy() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();
  useChapterScroll({ ref, chapterId: 1, pin: !lowFi, length: 2.5 });

  return (
    <section ref={ref} className={shared.section} data-chapter="1">
      <div className={shared.frame}>
        <span className={shared.place}>{copy.vichy.place}</span>
        <SplitTextLine as="p" type="lines" className={shared.body}>
          {copy.vichy.lines.join('\n')}
        </SplitTextLine>
      </div>
    </section>
  );
}
