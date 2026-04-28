import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { SplitTextLine } from '../components/SplitTextLine';
import { copy } from '../data/copy';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from '../styles/chapters/chapter-00.module.css';

export function Chapter00Hero() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();
  useChapterScroll({ ref, chapterId: 0, enabled: !lowFi });

  return (
    <section
      ref={ref}
      className={styles.section}
      data-chapter="0"
      style={{ height: lowFi ? '100vh' : '180vh' }}
    >
      <div className={styles.stickyStage}>
        <div className={styles.inner} data-chapter-content>
          <SplitTextLine as="h1" type="chars" ambient className={styles.line}>
            {copy.hero.line}
          </SplitTextLine>
          <span className={styles.scrollHint} aria-hidden="true">
            <span className={styles.scrollHintWord}>desliza</span>
            <em className={styles.scrollHintTrail} />
          </span>
        </div>
      </div>
    </section>
  );
}
