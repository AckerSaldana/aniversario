import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  ExtrudeGeometry,
  MeshPhysicalMaterial,
  Shape,
  type Mesh,
} from 'three';
import { useSceneStore } from './store';

// Material protagonista: rose suave con clearcoat, iridescencia y un poco de
// transmisión para que respire luz contra el fondo cósmico.
const material = new MeshPhysicalMaterial({
  color: '#e8b4b8',
  roughness: 0.22,
  metalness: 0.18,
  clearcoat: 1.0,
  clearcoatRoughness: 0.08,
  iridescence: 0.6,
  iridescenceIOR: 1.4,
  iridescenceThicknessRange: [120, 480],
  sheen: 0.6,
  sheenColor: '#e8c56b',
  sheenRoughness: 0.4,
  transmission: 0.12,
  thickness: 0.6,
  ior: 1.45,
  attenuationColor: '#c97b84',
  attenuationDistance: 4,
  emissive: '#ffc15c',
  emissiveIntensity: 0.05,
});

/**
 * Corazón geométrico simétrico con cusp inferior y dos lóbulos superiores.
 * Construido con cuatro curvas Bézier cúbicas balanceadas y centrado para
 * que la rotación quede en el medio visual.
 */
function createHeartShape() {
  const s = new Shape();
  const scale = 1;
  const dip = 0.55;       // qué tan profundo es el valle entre los lóbulos
  const lobeY = 0.95 * scale;
  const lobeX = 1.0 * scale;
  const tipY = -1.05 * scale;

  // Empezamos en el cusp/punta inferior
  s.moveTo(0, tipY);

  // Bajada derecha → subida hacia el lóbulo derecho
  s.bezierCurveTo(
    0.55 * scale, -0.55 * scale,
    1.05 * scale, -0.1 * scale,
    lobeX, 0.4 * scale
  );

  // Lóbulo derecho → curva al centro (valle)
  s.bezierCurveTo(
    1.0 * scale, lobeY,
    0.55 * scale, lobeY,
    0, dip * scale
  );

  // Centro → lóbulo izquierdo
  s.bezierCurveTo(
    -0.55 * scale, lobeY,
    -1.0 * scale, lobeY,
    -lobeX, 0.4 * scale
  );

  // Lóbulo izquierdo → punta inferior
  s.bezierCurveTo(
    -1.05 * scale, -0.1 * scale,
    -0.55 * scale, -0.55 * scale,
    0, tipY
  );

  return s;
}

function HeartGeometry() {
  const ref = useRef<Mesh>(null);

  const geometry = useMemo(() => {
    const shape = createHeartShape();
    const geom = new ExtrudeGeometry(shape, {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.18,
      bevelSize: 0.14,
      bevelOffset: 0,
      bevelSegments: 12,
      curveSegments: 48,
    });
    geom.center();
    geom.computeVertexNormals();
    return geom;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const state = useSceneStore.getState();
    const progress = state.globalProgress;
    const palette = state.palette;

    // Heartbeat sutil: pulso doble por ciclo, más marcado durante el burst.
    const beat = Math.sin(t * 1.6) * 0.5 + Math.sin(t * 1.6 + 0.4) * 0.5;
    const beatScale = 1 + beat * (0.015 + progress * 0.025);

    const spinFactor = 0.12 + progress * 0.28;
    ref.current.rotation.y = t * spinFactor;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.14;
    ref.current.rotation.z = Math.sin(t * 0.27) * 0.05;
    ref.current.position.y = Math.sin(t * 0.55) * 0.08;

    // En suspenso (progress < 0.05) el corazón es casi invisible y lejano.
    const presence = Math.max(0, (progress - 0.05) / 0.95);
    const baseScale = 0.25 + presence * 1.05;
    ref.current.scale.setScalar(baseScale * beatScale);
    ref.current.position.z = -2 + presence * 2;
    material.emissiveIntensity +=
      (palette.starEmissive * presence - material.emissiveIntensity) * 0.06;
    material.opacity = 0.15 + presence * 0.85;
    material.transparent = true;
  });

  return <mesh ref={ref} geometry={geometry} material={material} />;
}

export function Star() {
  return <HeartGeometry />;
}
