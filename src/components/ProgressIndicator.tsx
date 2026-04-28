import { useEffect, useState } from 'react';
import { useSceneStore } from '../three/store';
import { chapters } from '../data/copy';

import styles from './ProgressIndicator.module.css';

export function ProgressIndicator() {
  const chapter = useSceneStore((s) => s.chapter);
  const [globalProgress, setGlobalProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      // Calcula el progreso global a partir del scroll actual del documento.
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      setGlobalProgress(Math.min(1, Math.max(0, window.scrollY / max)));
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <aside className={styles.indicator} aria-hidden="true">
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ transform: `scaleY(${globalProgress})` }}
        />
      </div>
      <ol className={styles.list}>
        {chapters.map((c) => (
          <li
            key={c.id}
            className={`${styles.item} ${
              chapter === c.id ? styles.active : ''
            }`}
            data-roman={c.roman}
          >
            <span className={styles.roman}>{c.roman}</span>
            <span className={styles.label}>{c.label}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
