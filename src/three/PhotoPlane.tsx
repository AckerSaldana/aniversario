import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import type { Group } from 'three';

type Props = {
  src: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  aspect?: number;
  /** velocidad de oscilación */
  bob?: number;
  /** fase para evitar movimiento sincronizado entre polaroids */
  phase?: number;
};

export function PhotoPlane({
  src,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 1.4,
  aspect = 1.25,
  bob = 0.5,
  phase = 0,
}: Props) {
  const ref = useRef<Group>(null);
  const tex = useTexture(src);
  const height = width * aspect;
  const frame = 0.08;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime + phase;
    ref.current.position.y = position[1] + Math.sin(t * bob) * 0.06;
    ref.current.rotation.z = rotation[2] + Math.sin(t * bob * 0.7) * 0.04;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      {/* marco blanco detrás */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[width + frame, height + frame * 1.5]} />
        <meshBasicMaterial color="#f5efe6" />
      </mesh>
      {/* foto */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}
