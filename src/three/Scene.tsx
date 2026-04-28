import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import {
  FogExp2,
  type AmbientLight,
  type DirectionalLight,
  type HemisphereLight,
  type PointLight,
} from 'three';
import { Star } from './Star';
import { Particles } from './Particles';
import { Postprocessing } from './Postprocessing';
import { useSceneStore } from './store';

type Props = {
  postprocessing?: boolean;
};

export function Scene({ postprocessing = true }: Props) {
  const { scene } = useThree();
  const fog = useRef<FogExp2>(new FogExp2('#070310', 0.18));
  const ambientRef = useRef<AmbientLight>(null);
  const hemiRef = useRef<HemisphereLight>(null);
  const dirRef = useRef<DirectionalLight>(null);
  const dirSecondRef = useRef<DirectionalLight>(null);

  if (!scene.fog) {
    scene.fog = fog.current;
  }

  useFrame(() => {
    const palette = useSceneStore.getState().palette;
    fog.current.color.lerp(palette.fog, 0.06);
    fog.current.density += (palette.fogDensity - fog.current.density) * 0.06;

    if (ambientRef.current) {
      ambientRef.current.intensity +=
        (palette.ambient - ambientRef.current.intensity) * 0.06;
      ambientRef.current.color.lerp(palette.fog, 0.04);
    }
    if (hemiRef.current) {
      const target = palette.ambient * 0.9;
      hemiRef.current.intensity += (target - hemiRef.current.intensity) * 0.06;
    }
    if (dirRef.current) {
      const target = 0.4 + palette.ambient * 1.6;
      dirRef.current.intensity += (target - dirRef.current.intensity) * 0.06;
    }
    if (dirSecondRef.current) {
      const target = 0.15 + palette.ambient * 0.5;
      dirSecondRef.current.intensity +=
        (target - dirSecondRef.current.intensity) * 0.06;
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.18} color="#070310" />
      <hemisphereLight
        ref={hemiRef}
        args={['#fbf4ee', '#1a0e2a', 0.18]}
      />
      <directionalLight
        ref={dirRef}
        position={[3, 4, 2]}
        intensity={0.4}
        color="#fff5d6"
      />
      <directionalLight
        ref={dirSecondRef}
        position={[-3, -1, 1]}
        intensity={0.15}
        color="#a85d6e"
      />
      <OrbitingPointLight />
      <Star />
      <Particles count={1500} radius={9} />
      <Postprocessing enabled={postprocessing} />
    </>
  );
}

function OrbitingPointLight() {
  const ref = useRef<PointLight>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const palette = useSceneStore.getState().palette;
    const t = clock.elapsedTime * 0.4;
    ref.current.position.set(Math.cos(t) * 2.5, 1.2, Math.sin(t) * 2.5);
    const target = 0.4 + palette.ambient * 1.6;
    ref.current.intensity += (target - ref.current.intensity) * 0.06;
  });

  return (
    <pointLight ref={ref} intensity={0.4} distance={9} decay={2} color="#e8c56b" />
  );
}
