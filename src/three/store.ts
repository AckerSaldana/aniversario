import { create } from 'zustand';
import { Color } from 'three';

export type Palette = {
  particleA: Color;
  particleB: Color;
  particleC: Color;
  fog: Color;
  intensity: number;
  fogDensity: number;
  vignette: number;
  bloom: number;
  ambient: number;
  starEmissive: number;
  bgA: string;
  bgB: string;
  bgC: string;
  bgGlow: string;
};

type Keyframe = {
  t: number;
  particleA: string;
  particleB: string;
  particleC: string;
  fog: string;
  intensity: number;
  fogDensity: number;
  vignette: number;
  bloom: number;
  ambient: number;
  starEmissive: number;
  bgA: string;
  bgB: string;
  bgC: string;
  bgGlow: string;
};

const KEYFRAMES: Keyframe[] = [
  {
    t: 0.0,
    particleA: '#1a0e2a',
    particleB: '#3a2347',
    particleC: '#6a4a8a',
    fog: '#070310',
    intensity: 0.18,
    fogDensity: 0.18,
    vignette: 0.85,
    bloom: 0.0,
    ambient: 0.18,
    starEmissive: 0.05,
    bgA: 'rgba(26, 14, 42, 0.85)',
    bgB: 'rgba(58, 35, 71, 0.55)',
    bgC: 'rgba(74, 26, 50, 0.35)',
    bgGlow: '#07030f',
  },
  {
    t: 0.1,
    particleA: '#2a1840',
    particleB: '#4a2a55',
    particleC: '#8a5a9a',
    fog: '#0c0518',
    intensity: 0.32,
    fogDensity: 0.16,
    vignette: 0.78,
    bloom: 0.08,
    ambient: 0.22,
    starEmissive: 0.1,
    bgA: 'rgba(42, 24, 64, 0.85)',
    bgB: 'rgba(74, 42, 85, 0.55)',
    bgC: 'rgba(90, 30, 70, 0.35)',
    bgGlow: '#0a0418',
  },
  {
    t: 0.22,
    particleA: '#7a3a5a',
    particleB: '#a85d6e',
    particleC: '#e8a070',
    fog: '#2a1428',
    intensity: 0.6,
    fogDensity: 0.12,
    vignette: 0.55,
    bloom: 0.3,
    ambient: 0.38,
    starEmissive: 0.25,
    bgA: 'rgba(122, 58, 90, 0.7)',
    bgB: 'rgba(168, 93, 110, 0.5)',
    bgC: 'rgba(74, 26, 50, 0.4)',
    bgGlow: '#1a081a',
  },
  {
    t: 0.3,
    particleA: '#d04a6e',
    particleB: '#f0a058',
    particleC: '#ffd070',
    fog: '#a04860',
    intensity: 1.1,
    fogDensity: 0.07,
    vignette: 0.3,
    bloom: 0.7,
    ambient: 0.6,
    starEmissive: 0.55,
    bgA: 'rgba(208, 74, 110, 0.6)',
    bgB: 'rgba(240, 160, 88, 0.5)',
    bgC: 'rgba(255, 193, 92, 0.35)',
    bgGlow: '#3a1428',
  },
  {
    t: 0.34,
    particleA: '#ff6b8a',
    particleB: '#ffc15c',
    particleC: '#fff0b0',
    fog: '#f0c4b4',
    intensity: 1.65,
    fogDensity: 0.05,
    vignette: 0.18,
    bloom: 1.4,
    ambient: 0.78,
    starEmissive: 0.95,
    bgA: 'rgba(255, 107, 138, 0.55)',
    bgB: 'rgba(255, 193, 92, 0.5)',
    bgC: 'rgba(255, 240, 176, 0.35)',
    bgGlow: '#4a2030',
  },
  {
    t: 0.4,
    particleA: '#e88090',
    particleB: '#e8a958',
    particleC: '#f5d4a0',
    fog: '#e8b8a0',
    intensity: 1.2,
    fogDensity: 0.06,
    vignette: 0.28,
    bloom: 0.7,
    ambient: 0.66,
    starEmissive: 0.7,
    bgA: 'rgba(232, 128, 144, 0.5)',
    bgB: 'rgba(232, 169, 88, 0.45)',
    bgC: 'rgba(245, 212, 160, 0.3)',
    bgGlow: '#3a1828',
  },
  {
    t: 0.5,
    particleA: '#e0a899',
    particleB: '#c9a961',
    particleC: '#f0c4b4',
    fog: '#ecdfd0',
    intensity: 1.05,
    fogDensity: 0.07,
    vignette: 0.3,
    bloom: 0.55,
    ambient: 0.62,
    starEmissive: 0.55,
    bgA: 'rgba(224, 168, 153, 0.5)',
    bgB: 'rgba(201, 169, 97, 0.45)',
    bgC: 'rgba(240, 196, 180, 0.3)',
    bgGlow: '#2a1a1a',
  },
  {
    t: 0.65,
    particleA: '#c98271',
    particleB: '#e8c56b',
    particleC: '#f5d4d3',
    fog: '#f0c4b4',
    intensity: 1.1,
    fogDensity: 0.06,
    vignette: 0.32,
    bloom: 0.45,
    ambient: 0.6,
    starEmissive: 0.5,
    bgA: 'rgba(201, 130, 113, 0.5)',
    bgB: 'rgba(232, 197, 107, 0.45)',
    bgC: 'rgba(245, 212, 211, 0.3)',
    bgGlow: '#1f1010',
  },
  {
    t: 0.82,
    particleA: '#e8b4b8',
    particleB: '#e8c56b',
    particleC: '#fbf4ee',
    fog: '#fbf4ee',
    intensity: 0.85,
    fogDensity: 0.07,
    vignette: 0.32,
    bloom: 0.3,
    ambient: 0.58,
    starEmissive: 0.4,
    bgA: 'rgba(232, 180, 184, 0.5)',
    bgB: 'rgba(232, 197, 107, 0.4)',
    bgC: 'rgba(251, 244, 238, 0.3)',
    bgGlow: '#1a0c0c',
  },
  {
    t: 1.0,
    particleA: '#f5d4d3',
    particleB: '#fbf4ee',
    particleC: '#ffffff',
    fog: '#fbf4ee',
    intensity: 0.5,
    fogDensity: 0.08,
    vignette: 0.25,
    bloom: 0.18,
    ambient: 0.5,
    starEmissive: 0.3,
    bgA: 'rgba(245, 212, 211, 0.5)',
    bgB: 'rgba(251, 244, 238, 0.4)',
    bgC: 'rgba(255, 255, 255, 0.3)',
    bgGlow: '#0f0808',
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpHex(a: string, b: string, t: number, out: Color) {
  const ca = tmpA.set(a);
  const cb = tmpB.set(b);
  out.copy(ca).lerp(cb, t);
  return out;
}

function lerpRgba(a: string, b: string, t: number) {
  const pa = parseRgbaOrHex(a);
  const pb = parseRgbaOrHex(b);
  const r = Math.round(lerp(pa[0], pb[0], t));
  const g = Math.round(lerp(pa[1], pb[1], t));
  const bl = Math.round(lerp(pa[2], pb[2], t));
  const al = lerp(pa[3], pb[3], t);
  return `rgba(${r}, ${g}, ${bl}, ${al.toFixed(3)})`;
}

function parseRgbaOrHex(c: string): [number, number, number, number] {
  if (c.startsWith('#')) {
    const hex = c.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b, 1];
  }
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return [0, 0, 0, 1];
  const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, parts[3] ?? 1];
}

const tmpA = new Color();
const tmpB = new Color();

const derived: Palette = {
  particleA: new Color(),
  particleB: new Color(),
  particleC: new Color(),
  fog: new Color(),
  intensity: 0,
  fogDensity: 0.07,
  vignette: 0.45,
  bloom: 0,
  ambient: 0.55,
  starEmissive: 0.3,
  bgA: KEYFRAMES[0].bgA,
  bgB: KEYFRAMES[0].bgB,
  bgC: KEYFRAMES[0].bgC,
  bgGlow: KEYFRAMES[0].bgGlow,
};

export function derivePalette(t: number): Palette {
  const clamped = Math.max(0, Math.min(1, t));
  let aIdx = 0;
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (clamped >= KEYFRAMES[i].t && clamped <= KEYFRAMES[i + 1].t) {
      aIdx = i;
      break;
    }
    if (i === KEYFRAMES.length - 2 && clamped > KEYFRAMES[i + 1].t) {
      aIdx = i;
    }
  }
  const a = KEYFRAMES[aIdx];
  const b = KEYFRAMES[aIdx + 1] ?? KEYFRAMES[aIdx];
  const span = b.t - a.t;
  const local = span > 0 ? (clamped - a.t) / span : 0;

  lerpHex(a.particleA, b.particleA, local, derived.particleA);
  lerpHex(a.particleB, b.particleB, local, derived.particleB);
  lerpHex(a.particleC, b.particleC, local, derived.particleC);
  lerpHex(a.fog, b.fog, local, derived.fog);
  derived.intensity = lerp(a.intensity, b.intensity, local);
  derived.fogDensity = lerp(a.fogDensity, b.fogDensity, local);
  derived.vignette = lerp(a.vignette, b.vignette, local);
  derived.bloom = lerp(a.bloom, b.bloom, local);
  derived.ambient = lerp(a.ambient, b.ambient, local);
  derived.starEmissive = lerp(a.starEmissive, b.starEmissive, local);
  derived.bgA = lerpRgba(a.bgA, b.bgA, local);
  derived.bgB = lerpRgba(a.bgB, b.bgB, local);
  derived.bgC = lerpRgba(a.bgC, b.bgC, local);
  derived.bgGlow = lerpRgba(a.bgGlow, b.bgGlow, local);
  return derived;
}

type SceneState = {
  chapter: number;
  chapterProgress: number;
  globalProgress: number;
  heroFade: number;
  palette: Palette;
  setChapter: (n: number, slug?: string) => void;
  setChapterProgress: (p: number) => void;
  setGlobalProgress: (p: number) => void;
  setHeroFade: (v: number) => void;
};

export const useSceneStore = create<SceneState>((set) => ({
  chapter: 0,
  chapterProgress: 0,
  globalProgress: 0,
  heroFade: 1,
  palette: derivePalette(0),
  setChapter: (n) => set({ chapter: n }),
  setChapterProgress: (p) => set({ chapterProgress: p }),
  setGlobalProgress: (p) => {
    derivePalette(p);
    set({ globalProgress: p, palette: derived });
  },
  setHeroFade: (v) => set({ heroFade: v }),
}));
