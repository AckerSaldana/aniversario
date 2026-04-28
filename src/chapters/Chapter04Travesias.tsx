import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { SplitTextLine } from '../components/SplitTextLine';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { copy } from '../data/copy';
import shared from '../styles/chapters/chapter-shared.module.css';

// TODO (Fase B · gsap-storyteller):
// - grulla (escena 3D) crece y orbita
// - partículas viajan sobre MotionPath con arco "atlántico" Quebec → Hull
// - paleta vira de azul nocturno frío a celeste niebla británico
export function Chapter04Travesias() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();
  useChapterScroll({ ref, chapterId: 4, pin: !lowFi, length: 4 });

  return (
    <section ref={ref} className={shared.section} data-chapter="4">
      <div className={shared.frame}>
        <span className={shared.place}>{copy.quebec.place}</span>
        <SplitTextLine as="p" type="lines" className={shared.body}>
          {copy.quebec.lines.join('\n')}
        </SplitTextLine>

        <span className={shared.place} style={{ marginTop: 'var(--space-4)' }}>
          {copy.hull.place}
        </span>
        <SplitTextLine as="p" type="lines" className={shared.body}>
          {copy.hull.lines.join('\n')}
        </SplitTextLine>
      </div>
    </section>
  );
}
