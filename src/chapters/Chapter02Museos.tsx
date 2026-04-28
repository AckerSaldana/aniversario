import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { SplitTextLine } from '../components/SplitTextLine';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { copy } from '../data/copy';
import { photos } from '../data/photos';
import { Polaroid } from '../components/Polaroid';
import shared from '../styles/chapters/chapter-shared.module.css';

export function Chapter02Museos() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();
  useChapterScroll({ ref, chapterId: 2, enabled: !lowFi });

  return (
    <section
      ref={ref}
      className={shared.section}
      data-chapter="2"
      style={{ height: lowFi ? '100vh' : '300vh' }}
    >
      <div className={shared.stickyStage}>
        <div className={shared.frame} data-chapter-content>
          <span className={shared.place}>{copy.marco.place}</span>
          <SplitTextLine as="p" type="lines" className={`${shared.body} ${shared.bodySm}`}>
            {copy.marco.lines.join('\n')}
          </SplitTextLine>

          <div className={shared.polaroidsRow}>
            {photos.marco.slice(0, 3).map((p, i) => (
              <Polaroid
                key={p.src}
                src={p.src}
                alt={p.alt}
                rotate={i === 0 ? -2 : i === 2 ? 3 : 0}
              />
            ))}
          </div>

          <span className={shared.place} style={{ marginTop: 'var(--space-2)' }}>
            {copy.desierto.place}
          </span>
          <SplitTextLine as="p" type="lines" className={`${shared.body} ${shared.bodySm}`}>
            {copy.desierto.lines.join('\n')}
          </SplitTextLine>
        </div>
      </div>
    </section>
  );
}
