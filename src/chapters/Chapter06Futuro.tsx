import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { SplitTextLine } from '../components/SplitTextLine';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { copy } from '../data/copy';
import styles from '../styles/chapters/chapter-06.module.css';

export function Chapter06Futuro() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();
  useChapterScroll({ ref, chapterId: 6, pin: !lowFi, length: 1.5 });

  return (
    <section ref={ref} className={styles.section} data-chapter="6">
      <div className={styles.frame}>
        <SplitTextLine as="h2" type="words" className={styles.line}>
          {copy.futuro.line}
        </SplitTextLine>
        <p className={styles.credits}>{copy.futuro.credits}</p>
      </div>
    </section>
  );
}
