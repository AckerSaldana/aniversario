import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { copy } from '../data/copy';
import { photos } from '../data/photos';
import styles from '../styles/chapters/chapter-03.module.css';

export function Chapter03Mosaico() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();
  // mosaico no necesita pin: sus tiles entran por stagger al cruzar el viewport.
  useChapterScroll({ ref, chapterId: 3, pin: false, length: 1, enabled: !lowFi });

  return (
    <section ref={ref} className={styles.section} data-chapter="3">
      <div>
        <ul className={styles.grid}>
          {photos.mosaico.map((p) => (
            <li key={p.src} className={styles.tile}>
              <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
            </li>
          ))}
        </ul>
        <p className={styles.line}>{copy.mosaico.line}</p>
      </div>
    </section>
  );
}
