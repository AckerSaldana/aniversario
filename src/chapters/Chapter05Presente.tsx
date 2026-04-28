import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { SplitTextLine } from '../components/SplitTextLine';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { copy } from '../data/copy';
import shared from '../styles/chapters/chapter-shared.module.css';

// TODO (Fase B): cámara 3D se aleja, polaroids 3D flotando alrededor de la grulla.
// Por ahora solo el copy contemplativo en el centro.
export function Chapter05Presente() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();
  useChapterScroll({ ref, chapterId: 5, pin: !lowFi, length: 2 });

  return (
    <section ref={ref} className={shared.section} data-chapter="5">
      <div className={`${shared.frame} ${shared.center}`}>
        <SplitTextLine
          as="p"
          type="lines"
          className={`${shared.body} ${shared.bodyLg}`}
        >
          {copy.presente.lines.join('\n')}
        </SplitTextLine>
      </div>
    </section>
  );
}
