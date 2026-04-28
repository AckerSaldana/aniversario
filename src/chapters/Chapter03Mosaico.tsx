import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SplitTextLine } from '../components/SplitTextLine';
import { copy } from '../data/copy';
import { photos } from '../data/photos';
import { Polaroid3D } from '../components/Polaroid3D';
import styles from '../styles/chapters/chapter-03.module.css';

const TILE_CONFIG: {
  rotate: number;
  width: number;
  className: string;
  caption: string;
}[] = [
  { rotate: -6, width: 185, className: 'tile0', caption: 'EscapeRoom' },
  { rotate: 4, width: 165, className: 'tile1', caption: 'Quebec Beis' },
  { rotate: -3, width: 195, className: 'tile2', caption: 'Sultanes' },
  { rotate: 5, width: 175, className: 'tile3', caption: 'DaleMixx' },
  { rotate: -2, width: 200, className: 'tile4', caption: 'Sea at Hull' },
  { rotate: 3, width: 170, className: 'tile5', caption: 'SixFlags' },
];

export function Chapter03Mosaico() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();
  useChapterScroll({ ref, chapterId: 3, enabled: !lowFi });

  return (
    <section
      ref={ref}
      className={styles.section}
      data-chapter="3"
      style={{ height: lowFi ? '100vh' : '200vh' }}
    >
      <div className={styles.stickyStage}>
        <div className={styles.frame} data-chapter-content>
          <ul className={styles.scatter}>
            {photos.mosaico.map((p, i) => {
              const cfg = TILE_CONFIG[i] ?? TILE_CONFIG[0];
              return (
                <li
                  key={p.src}
                  className={`${styles.tile} ${styles[cfg.className]}`}
                >
                  <Polaroid3D
                    src={p.src}
                    alt={p.alt}
                    video={p.video}
                    caption={cfg.caption}
                    rotate={cfg.rotate}
                    width={cfg.width}
                  />
                </li>
              );
            })}
          </ul>
          <SplitTextLine as="p" type="words" className={styles.line}>
            {copy.mosaico.line}
          </SplitTextLine>
        </div>
      </div>
    </section>
  );
}
