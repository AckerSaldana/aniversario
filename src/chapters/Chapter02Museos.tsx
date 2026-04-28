import { useRef } from 'react';
import { useChapterScroll } from '../hooks/useChapterScroll';
import { SplitTextLine } from '../components/SplitTextLine';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { copy } from '../data/copy';
import { photos } from '../data/photos';
import { Polaroid } from '../components/Polaroid';
import shared from '../styles/chapters/chapter-shared.module.css';

// TODO (Fase B): timeline horizontal scrubbed para MARCO
// + transición de paleta a árido para Desierto.
export function Chapter02Museos() {
  const ref = useRef<HTMLElement>(null);
  const { lowFi } = useReducedMotion();
  useChapterScroll({ ref, chapterId: 2, pin: !lowFi, length: 3 });

  return (
    <section ref={ref} className={shared.section} data-chapter="2">
      <div className={shared.frame}>
        <span className={shared.place}>{copy.marco.place}</span>
        <SplitTextLine as="p" type="lines" className={shared.body}>
          {copy.marco.lines.join('\n')}
        </SplitTextLine>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
          {photos.marco.slice(0, 3).map((p, i) => (
            <Polaroid
              key={p.src}
              src={p.src}
              alt={p.alt}
              rotate={i === 0 ? -2 : i === 2 ? 3 : 0}
            />
          ))}
        </div>

        <span className={shared.place} style={{ marginTop: 'var(--space-4)' }}>
          {copy.desierto.place}
        </span>
        <SplitTextLine as="p" type="lines" className={shared.body}>
          {copy.desierto.lines.join('\n')}
        </SplitTextLine>
      </div>
    </section>
  );
}
