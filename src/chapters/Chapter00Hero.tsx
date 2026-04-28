import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { SplitTextLine } from '../components/SplitTextLine';
import { copy } from '../data/copy';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from '../styles/chapters/chapter-00.module.css';

export function Chapter00Hero() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();

  // El morph (fade out al final del pin) ya lo maneja useChapterScroll.
  useChapterScroll({
    ref,
    chapterId: 0,
    pin: !lowFi,
    length: 1.6,
    enabled: true,
  });

  return (
    <section ref={ref} className={styles.section} data-chapter="0">
      <div className={styles.inner} data-chapter-content>
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.kicker}>Dos años</span>
        <SplitTextLine as="h1" type="chars" ambient className={styles.line}>
          {copy.hero.line}
        </SplitTextLine>
        <span className={styles.scrollHint} aria-hidden="true">
          <span>scroll</span>
          <em />
        </span>
      </div>
    </section>
  );
}
