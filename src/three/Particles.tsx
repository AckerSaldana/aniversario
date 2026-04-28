import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  Points,
  ShaderMaterial,
} from 'three';
import vertexShader from './shaders/particles.vert.glsl?raw';
import fragmentShader from './shaders/particles.frag.glsl?raw';
import { useSceneStore } from './store';

type Props = {
  count?: number;
  radius?: number;
};

/** Estallidos de partículas por capítulo. Cada midpoint del capítulo
 *  dispara una gaussiana de uExplosion para que las partículas chispeen. */
const EXPLOSION_PEAKS = [
  { t: 0.18, mag: 0.45, width: 0.045 }, // vichy
  { t: 0.34, mag: 1.0, width: 0.06 },   // norte (clímax)
  { t: 0.49, mag: 0.65, width: 0.045 }, // mosaico
  { t: 0.65, mag: 0.5, width: 0.05 },   // travesías
  { t: 0.83, mag: 0.45, width: 0.045 }, // presente
  { t: 0.95, mag: 0.4, width: 0.035 },  // futuro
];

export function Particles({ count = 1500, radius = 8 }: Props) {
  const ref = useRef<Points>(null);
  const { gl } = useThree();

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      scales[i] = 0.4 + Math.random() * 1.6;
      phases[i] = Math.random() * Math.PI * 2;
    }

    g.setAttribute('position', new BufferAttribute(positions, 3));
    g.setAttribute('aScale', new BufferAttribute(scales, 1));
    g.setAttribute('aPhase', new BufferAttribute(phases, 1));
    return g;
  }, [count, radius]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: NormalBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
          uSize: { value: 90 },
          uIntensity: { value: 0.18 },
          uExplosion: { value: 0 },
          uColorA: { value: new Color('#1a0e2a') },
          uColorB: { value: new Color('#3a2347') },
          uColorC: { value: new Color('#6a4a8a') },
        },
      }),
    [gl]
  );

  useFrame(({ clock }) => {
    const state = useSceneStore.getState();
    const palette = state.palette;
    const t = state.globalProgress;

    // Estallidos por capítulo: suma de gaussianas en cada midpoint.
    let explosionTarget = 0;
    for (let i = 0; i < EXPLOSION_PEAKS.length; i++) {
      const p = EXPLOSION_PEAKS[i];
      explosionTarget += p.mag * Math.exp(-Math.pow((t - p.t) / p.width, 2));
    }
    if (explosionTarget > 1) explosionTarget = 1;
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uColorA.value.lerp(palette.particleA, 0.08);
    material.uniforms.uColorB.value.lerp(palette.particleB, 0.08);
    material.uniforms.uColorC.value.lerp(palette.particleC, 0.08);
    material.uniforms.uIntensity.value +=
      (palette.intensity - material.uniforms.uIntensity.value) * 0.06;
    material.uniforms.uExplosion.value +=
      (explosionTarget - material.uniforms.uExplosion.value) * 0.18;

    if (ref.current) {
      // Spin más rápido durante el pico — sensación de remolino
      const spin = 0.02 + material.uniforms.uExplosion.value * 0.1;
      ref.current.rotation.y += spin * 0.016;
    }
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}
