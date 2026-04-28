import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Vignette, Noise, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import type { VignetteEffect, BloomEffect } from 'postprocessing';
import { useSceneStore } from './store';

type Props = {
  enabled?: boolean;
};

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
    const palette = useSceneStore.getState().palette;
    lerpedVignette.current += (palette.vignette - lerpedVignette.current) * 0.12;
    lerpedBloom.current += (palette.bloom - lerpedBloom.current) * 0.15;

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
