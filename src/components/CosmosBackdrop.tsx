import { useEffect } from 'react';
import { useSceneStore } from '../three/store';

type FgState = {
  fg: string;
  fgMuted: string;
  fgShadow: string;
};

const CREAM: FgState = {
  fg: '#fbf4ee',
  fgMuted: 'rgba(245, 212, 211, 0.82)',
  fgShadow: 'rgba(0, 0, 0, 0.6)',
};

const INK: FgState = {
  fg: '#3a2a24',
  fgMuted: 'rgba(140, 80, 90, 0.92)',
  fgShadow: 'rgba(0, 0, 0, 0.18)',
};

/**
 * Color de texto en función del scroll global.
 *
 * El backdrop morphing es DARK casi todo el scroll (el bgGlow va de #07030f
 * a #4a2030 en el burst, después regresa a #1a0c0c hacia el final). Solo
 * durante el burst peak (~t=0.34) el fondo es realmente brillante.
 *
 * Por eso usamos CREAM por default y solo switcheamos a INK en la ventana
 * estrecha del burst, con transiciones suaves a cada lado.
 */
function deriveFg(t: number): FgState {
  // Ventanas: cream | trans | ink | trans | cream
  const inkStart = 0.31;
  const inkEnd = 0.38;
  const transWidth = 0.04;

  if (t < inkStart - transWidth) return CREAM;
  if (t > inkEnd + transWidth) return CREAM;
  if (t >= inkStart && t <= inkEnd) return INK;

  if (t < inkStart) {
    // Cream → Ink
    const local = (t - (inkStart - transWidth)) / transWidth;
    return interpolate(CREAM, INK, local);
  }
  // Ink → Cream
  const local = (t - inkEnd) / transWidth;
  return interpolate(INK, CREAM, local);
}

function interpolate(a: FgState, b: FgState, t: number): FgState {
  return {
    fg: lerpRgb(a.fg, b.fg, t),
    fgMuted: lerpRgba(a.fgMuted, b.fgMuted, t),
    fgShadow: lerpRgba(a.fgShadow, b.fgShadow, t),
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpRgb(a: string, b: string, t: number): string {
  const [ar, ag, ab] = parseRgb(a);
  const [br, bg, bb] = parseRgb(b);
  return `rgb(${Math.round(lerp(ar, br, t))}, ${Math.round(
    lerp(ag, bg, t)
  )}, ${Math.round(lerp(ab, bb, t))})`;
}

function lerpRgba(a: string, b: string, t: number): string {
  const [ar, ag, ab, aa] = parseRgba(a);
  const [br, bg, bb, ba] = parseRgba(b);
  return `rgba(${Math.round(lerp(ar, br, t))}, ${Math.round(
    lerp(ag, bg, t)
  )}, ${Math.round(lerp(ab, bb, t))}, ${lerp(aa, ba, t).toFixed(3)})`;
}

function parseRgb(s: string): [number, number, number] {
  if (s.startsWith('#')) {
    const hex = s.slice(1);
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return [0, 0, 0];
  const parts = m[1].split(',').map((p) => parseFloat(p.trim()));
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
}

function parseRgba(s: string): [number, number, number, number] {
  const [r, g, b] = parseRgb(s);
  if (s.startsWith('#')) return [r, g, b, 1];
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return [r, g, b, 1];
  const parts = m[1].split(',').map((p) => parseFloat(p.trim()));
  return [r, g, b, parts[3] ?? 1];
}

export function CosmosBackdrop() {
  useEffect(() => {
    let raf = 0;
    const root = document.documentElement;

    const tick = () => {
      const state = useSceneStore.getState();
      const palette = state.palette;
      root.style.setProperty('--bg-a', palette.bgA);
      root.style.setProperty('--bg-b', palette.bgB);
      root.style.setProperty('--bg-c', palette.bgC);
      root.style.setProperty('--bg-glow', palette.bgGlow);

      const { fg, fgMuted, fgShadow } = deriveFg(state.globalProgress);
      root.style.setProperty('--story-fg', fg);
      root.style.setProperty('--story-fg-muted', fgMuted);
      root.style.setProperty('--story-fg-shadow', fgShadow);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  return <div className="cosmos-backdrop" aria-hidden="true" />;
}
