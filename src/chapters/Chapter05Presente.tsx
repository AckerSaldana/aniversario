import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { SplitTextLine } from '../components/SplitTextLine';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { copy } from '../data/copy';
import shared from '../styles/chapters/chapter-shared.module.css';

export function Chapter05Presente() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();
  useChapterScroll({ ref, chapterId: 5, enabled: !lowFi });

  return (
    <section
      ref={ref}
      className={shared.section}
      data-chapter="5"
      style={{ height: lowFi ? '100vh' : '220vh' }}
    >
      <div className={shared.stickyStage}>
        <div className={`${shared.frame} ${shared.center}`} data-chapter-content>
          <SplitTextLine
            as="p"
            type="lines"
            className={`${shared.body} ${shared.bodyLg}`}
          >
            {copy.presente.lines.join('\n')}
          </SplitTextLine>
        </div>
      </div>
    </section>
  );
}
