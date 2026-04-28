import { useEffect, useRef } from 'react';
import { useSceneStore } from '../three/store';
import styles from './CosmosBackdrop.module.css';

// Curva de color de texto: cream durante suspenso, ink durante la fase saturada,
// warm-cream al final etéreo. Snap-rápido alrededor del pico para evitar el
// "gris intermedio" ilegible mientras se cruza la transición.
function deriveFg(t: number): { fg: string; fgMuted: string } {
  // 0..0.26 → cream; 0.26..0.36 → transición; 0.36..0.84 → ink; 0.84..1 → warm-cream
  if (t < 0.26) {
    return { fg: '#fbf4ee', fgMuted: 'rgba(245, 212, 211, 0.78)' };
  }
  if (t < 0.36) {
    const local = (t - 0.26) / 0.1;
    const r = Math.round(lerp(251, 58, local));
    const g = Math.round(lerp(244, 42, local));
    const b = Math.round(lerp(238, 36, local));
    return {
      fg: `rgb(${r}, ${g}, ${b})`,
      fgMuted: `rgba(${Math.round(lerp(245, 201, local))}, ${Math.round(
        lerp(212, 123, local)
      )}, ${Math.round(lerp(211, 132, local))}, 0.85)`,
    };
  }
  if (t < 0.84) {
    return { fg: '#3a2a24', fgMuted: 'rgba(201, 123, 132, 0.9)' };
  }
  const local = (t - 0.84) / 0.16;
  const r = Math.round(lerp(58, 92, local));
  const g = Math.round(lerp(42, 68, local));
  const b = Math.round(lerp(36, 56, local));
  return {
    fg: `rgb(${r}, ${g}, ${b})`,
    fgMuted: `rgba(${Math.round(lerp(201, 232, local))}, ${Math.round(
      lerp(123, 180, local)
    )}, ${Math.round(lerp(132, 184, local))}, 0.85)`,
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function CosmosBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const node = ref.current;
    if (!node) return;
    const root = document.documentElement;

    const tick = () => {
      const state = useSceneStore.getState();
      const palette = state.palette;
      node.style.setProperty('--bg-a', palette.bgA);
      node.style.setProperty('--bg-b', palette.bgB);
      node.style.setProperty('--bg-c', palette.bgC);
      node.style.setProperty('--bg-glow', palette.bgGlow);

      const { fg, fgMuted } = deriveFg(state.globalProgress);
      root.style.setProperty('--story-fg', fg);
      root.style.setProperty('--story-fg-muted', fgMuted);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  return <div ref={ref} className={styles.backdrop} aria-hidden="true" />;
}
