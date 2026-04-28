import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { SplitTextLine } from '../components/SplitTextLine';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { copy } from '../data/copy';
import styles from '../styles/chapters/chapter-06.module.css';

export function Chapter06Futuro() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();
  useChapterScroll({ ref, chapterId: 6, enabled: !lowFi });

  return (
    <section
      ref={ref}
      className={styles.section}
      data-chapter="6"
      style={{ height: lowFi ? '100vh' : '180vh' }}
    >
      <div className={styles.stickyStage}>
        <div className={styles.frame} data-chapter-content>
          <SplitTextLine as="h2" type="words" className={styles.line}>
            {copy.futuro.line}
          </SplitTextLine>
          <p className={styles.credits}>{copy.futuro.credits}</p>
        </div>
      </div>
    </section>
  );
}
