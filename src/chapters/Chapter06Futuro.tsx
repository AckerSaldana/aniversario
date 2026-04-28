import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { SplitTextLine } from '../components/SplitTextLine';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { copy } from '../data/copy';
import shared from '../styles/chapters/chapter-shared.module.css';
import styles from '../styles/chapters/chapter-06.module.css';

export function Chapter06Futuro() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();
  useChapterScroll({ ref, chapterId: 6, enabled: !lowFi, final: true });

  return (
    <section
      ref={ref}
      className={styles.section}
      data-chapter="6"
      style={{ minHeight: '100vh' }}
    >
      <div className={styles.frame} data-chapter-content>
        <SplitTextLine as="h2" type="words" className={styles.line}>
          {copy.futuro.line}
        </SplitTextLine>

        <p className={shared.closing}>Atentamente,</p>
        <p className={shared.signature}>Acker</p>
      </div>
    </section>
  );
}
