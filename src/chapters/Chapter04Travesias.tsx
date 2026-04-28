import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { SplitTextLine } from '../components/SplitTextLine';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { copy } from '../data/copy';
import shared from '../styles/chapters/chapter-shared.module.css';
import styles from '../styles/chapters/chapter-04.module.css';

export function Chapter04Travesias() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();
  useChapterScroll({ ref, chapterId: 4, enabled: !lowFi });

  return (
    <section
      ref={ref}
      className={shared.section}
      data-chapter="4"
      style={{ height: lowFi ? '100vh' : '380vh' }}
    >
      <div className={shared.stickyStage}>
        <div className={styles.frame} data-chapter-content>
          <div className={styles.block}>
            <span className={shared.place}>{copy.quebec.place}</span>
            <SplitTextLine as="p" type="lines" className={shared.body}>
              {copy.quebec.lines.join('\n')}
            </SplitTextLine>
          </div>

          <div className={styles.block}>
            <span className={shared.place}>{copy.hull.place}</span>
            <SplitTextLine as="p" type="lines" className={shared.body}>
              {copy.hull.lines.join('\n')}
            </SplitTextLine>
          </div>
        </div>
      </div>
    </section>
  );
}
