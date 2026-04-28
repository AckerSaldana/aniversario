import { create } from 'zustand';
import { Color } from 'three';

export type Palette = {
  particleA: Color;
  particleB: Color;
  fog: Color;
  intensity: number;
};

const PALETTES: Record<string, Palette> = {
  hero: {
    particleA: new Color('#e8b4b8'),
    particleB: new Color('#e8c56b'),
    fog: new Color('#fbf4ee'),
    intensity: 0.6,
  },
  vichy: {
    particleA: new Color('#c97b84'),
    particleB: new Color('#e8c56b'),
    fog: new Color('#f5ebe0'),
    intensity: 1,
  },
  museos: {
    particleA: new Color('#e0a899'),
    particleB: new Color('#c9a961'),
    fog: new Color('#ecdfd0'),
    intensity: 0.85,
  },
  mosaico: {
    particleA: new Color('#f5d4d3'),
    particleB: new Color('#e8c56b'),
    fog: new Color('#fbf4ee'),
    intensity: 0.7,
  },
  travesias: {
    particleA: new Color('#c98271'),
    particleB: new Color('#e8c56b'),
    fog: new Color('#f0c4b4'),
    intensity: 1.1,
  },
  presente: {
    particleA: new Color('#e8b4b8'),
    particleB: new Color('#e8c56b'),
    fog: new Color('#fbf4ee'),
    intensity: 0.9,
  },
  futuro: {
    particleA: new Color('#f5d4d3'),
    particleB: new Color('#fbf4ee'),
    fog: new Color('#fbf4ee'),
    intensity: 0.5,
  },
};

type SceneState = {
  chapter: number;
  chapterProgress: number;
  globalProgress: number;
  heroFade: number; // 0..1, opacidad del contenido del hero al hacer scroll
  palette: Palette;
  setChapter: (n: number, slug: string) => void;
  setChapterProgress: (p: number) => void;
  setGlobalProgress: (p: number) => void;
  setHeroFade: (v: number) => void;
};

export const useSceneStore = create<SceneState>((set) => ({
  chapter: 0,
  chapterProgress: 0,
  globalProgress: 0,
  heroFade: 1,
  palette: PALETTES.hero,
  setChapter: (n, slug) =>
    set({ chapter: n, palette: PALETTES[slug] ?? PALETTES.hero }),
  setChapterProgress: (p) => set({ chapterProgress: p }),
  setGlobalProgress: (p) => set({ globalProgress: p }),
  setHeroFade: (v) => set({ heroFade: v }),
}));

export const palettes = PALETTES;
