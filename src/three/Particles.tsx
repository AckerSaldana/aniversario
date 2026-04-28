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
        // En fondo claro, additive lava todo a blanco. Normal con alpha
        // controlado deja las partículas como motas de polvo coloreado.
        blending: NormalBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
          uSize: { value: 80 },
          uIntensity: { value: 1 },
          uColorA: { value: new Color('#e8b4b8') },
          uColorB: { value: new Color('#e8c56b') },
        },
      }),
    [gl]
  );

  useFrame(({ clock }) => {
    const palette = useSceneStore.getState().palette;
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uColorA.value.lerp(palette.particleA, 0.05);
    material.uniforms.uColorB.value.lerp(palette.particleB, 0.05);
    material.uniforms.uIntensity.value +=
      (palette.intensity - material.uniforms.uIntensity.value) * 0.05;

    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.02;
    }
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}
