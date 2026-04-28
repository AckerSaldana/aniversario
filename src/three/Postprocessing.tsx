import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Vignette, Noise, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import type { VignetteEffect, BloomEffect } from 'postprocessing';
import { useSceneStore } from './store';

type Props = {
  enabled?: boolean;
};

/** Estallidos de bloom centrados en cada midpoint de capítulo (en globalProgress).
 *  Cada uno es una gaussiana — el ancho controla qué tan corto es el flash. */
const BLOOM_PEAKS = [
  { t: 0.18, mag: 0.55, width: 0.04 }, // vichy
  { t: 0.34, mag: 1.4, width: 0.045 }, // norte (clímax)
  { t: 0.49, mag: 0.85, width: 0.04 }, // mosaico
  { t: 0.65, mag: 0.55, width: 0.045 }, // travesías
  { t: 0.83, mag: 0.55, width: 0.04 }, // presente
  { t: 0.95, mag: 0.5, width: 0.035 }, // futuro shimmer
];

/**
 * IMPORTANTE: usamos callback refs (no useRef) en Vignette/Bloom porque
 * @react-three/postprocessing v3 hace `JSON.stringify(props)` como dep de
 * useMemo en cada render. Un objeto useRef cuyo `.current` apunta a un
 * Effect (Three Object3D con `parent` circular) crashea esa serialización.
 * Las funciones son excluidas por JSON.stringify, así que el callback ref
 * pasa limpio.
 */
export function Postprocessing({ enabled = true }: Props) {
  const vignetteRef = useRef<VignetteEffect | null>(null);
  const bloomRef = useRef<BloomEffect | null>(null);
  const lerpedVignette = useRef(0.85);
  const lerpedBloom = useRef(0);

  useFrame(() => {
    const state = useSceneStore.getState();
    const palette = state.palette;
    const t = state.globalProgress;

    // Estallidos de bloom por capítulo: gaussianas sumadas, cada una en el
    // midpoint de un capítulo con magnitud y carácter propios.
    let bloomTarget = palette.bloom * 0.4; // baseline de la paleta
    for (let i = 0; i < BLOOM_PEAKS.length; i++) {
      const p = BLOOM_PEAKS[i];
      bloomTarget += p.mag * Math.exp(-Math.pow((t - p.t) / p.width, 2));
    }

    lerpedVignette.current += (palette.vignette - lerpedVignette.current) * 0.12;
    lerpedBloom.current += (bloomTarget - lerpedBloom.current) * 0.15;

    if (vignetteRef.current) {
      vignetteRef.current.darkness = lerpedVignette.current;
    }
    if (bloomRef.current) {
      bloomRef.current.intensity = lerpedBloom.current;
    }
  });

  if (!enabled) return null;
  return (
    <EffectComposer>
      <Bloom
        ref={(node: BloomEffect | null) => {
          bloomRef.current = node;
        }}
        intensity={0}
        luminanceThreshold={0.42}
        luminanceSmoothing={0.22}
        mipmapBlur
      />
      <Vignette
        ref={(node: VignetteEffect | null) => {
          vignetteRef.current = node;
        }}
        eskil={false}
        offset={0.32}
        darkness={0.85}
      />
      <Noise opacity={0.05} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
}
