import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { FogExp2, type PointLight } from 'three';
import { Star } from './Star';
import { Particles } from './Particles';
import { Postprocessing } from './Postprocessing';
import { useSceneStore } from './store';

type Props = {
  postprocessing?: boolean;
};

export function Scene({ postprocessing = true }: Props) {
  const { scene } = useThree();
  const fog = useRef<FogExp2>(new FogExp2('#fbf4ee', 0.07));

  if (!scene.fog) {
    scene.fog = fog.current;
  }

  useFrame(() => {
    const palette = useSceneStore.getState().palette;
    fog.current.color.lerp(palette.fog, 0.04);
  });

  return (
    <>
      {/* fondo cálido difuso con un poco de brillo dorado */}
      <ambientLight intensity={0.55} color="#fbf4ee" />
      <hemisphereLight args={['#fbf4ee', '#e8c56b', 0.6]} />
      <directionalLight position={[3, 4, 2]} intensity={1.6} color="#fff5d6" />
      <directionalLight position={[-3, -1, 1]} intensity={0.4} color="#e8b4b8" />
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
    const t = clock.elapsedTime * 0.4;
    ref.current.position.set(Math.cos(t) * 2.5, 1.2, Math.sin(t) * 2.5);
  });

  return (
    <pointLight ref={ref} intensity={1.4} distance={9} decay={2} color="#e8c56b" />
  );
}
