import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { SplitTextLine } from '../components/SplitTextLine';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { copy } from '../data/copy';
import { photos } from '../data/photos';
import { Polaroid3D } from '../components/Polaroid3D';
import shared from '../styles/chapters/chapter-shared.module.css';
import styles from '../styles/chapters/chapter-02.module.css';

export function Chapter02Museos() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();
  useChapterScroll({ ref, chapterId: 2, enabled: !lowFi });

  return (
    <section
      ref={ref}
      className={shared.section}
      data-chapter="2"
      style={{ height: lowFi ? '100vh' : '320vh' }}
    >
      <div className={shared.stickyStage}>
        <div className={styles.spread} data-chapter-content>
          <div className={styles.column}>
            <span className={shared.place}>{copy.palnorte.place}</span>
            <SplitTextLine as="p" type="lines" className={shared.body}>
              {copy.palnorte.lines.join('\n')}
            </SplitTextLine>

            <span className={`${shared.place} ${styles.placeSecond}`}>
              {copy.desierto.place}
            </span>
            <SplitTextLine as="p" type="lines" className={shared.body}>
              {copy.desierto.lines.join('\n')}
            </SplitTextLine>
          </div>

          <aside className={styles.stack}>
            {photos.palnorte.slice(0, 3).map((p, i) => {
              const captions = ['Pal Norte', 'Columpios', 'Dinoquesadillas'];
              return (
                <Polaroid3D
                  key={p.src}
                  src={p.src}
                  alt={p.alt}
                  video={p.video}
                  caption={captions[i]}
                  rotate={i === 0 ? -4 : i === 1 ? 3 : -5}
                  width={i === 1 ? 260 : 230}
                  className={styles[`polaroid${i}`]}
                />
              );
            })}
          </aside>
        </div>
      </div>
    </section>
  );
}
