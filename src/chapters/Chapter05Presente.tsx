import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { SplitTextLine } from '../components/SplitTextLine';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { copy } from '../data/copy';
import shared from '../styles/chapters/chapter-shared.module.css';
import styles from '../styles/chapters/chapter-05.module.css';

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
        <div className={styles.crescendo} data-chapter-content>
          <SplitTextLine as="p" type="words" className={`${styles.line} ${styles.line0}`}>
            {copy.presente.lines[0]}
          </SplitTextLine>
          <SplitTextLine as="p" type="words" className={`${styles.line} ${styles.line1}`}>
            {copy.presente.lines[1]}
          </SplitTextLine>
          <SplitTextLine as="p" type="words" className={`${styles.line} ${styles.line2}`}>
            {copy.presente.lines[2]}
          </SplitTextLine>
        </div>
      </div>
    </section>
  );
}
