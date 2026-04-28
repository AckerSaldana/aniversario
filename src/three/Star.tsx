import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  Color,
  ExtrudeGeometry,
  type Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Shape,
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

// Material del aura/halo principal — aditivo, glow cálido.
const haloMaterial = new MeshBasicMaterial({
  color: '#ffc15c',
  transparent: true,
  opacity: 0,
  blending: AdditiveBlending,
  depthWrite: false,
  toneMapped: false,
});

// Material del ripple — onda que se expande periódicamente (más sutil).
const rippleMaterial = new MeshBasicMaterial({
  color: '#ffc15c',
  transparent: true,
  opacity: 0,
  blending: AdditiveBlending,
  depthWrite: false,
  toneMapped: false,
});

const haloColorTarget = new Color('#ffc15c');

// Color del corazón: arranca en rose/dusty pink, vira a rojo profundo
// hacia el final del scroll (futuro). El halo y emissive acompañan.
const heartColorStart = new Color('#e8b4b8'); // rose original
const heartColorEnd = new Color('#d4334a'); // rojo amor profundo
const heartEmissiveStart = new Color('#ffc15c'); // dorado cálido
const heartEmissiveEnd = new Color('#ff5060'); // rojo brillante
const heartColorTarget = new Color();
const heartEmissiveTarget = new Color();

/** Smoothstep — easing s-shape entre 0 y 1. */
function smoothstep(x: number): number {
  return x * x * (3 - 2 * x);
}

/** Factor de transición a rojo: 0 al principio, sube en el último tramo. */
function redness(progress: number): number {
  const start = 0.65;
  const end = 0.98;
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return smoothstep((progress - start) / (end - start));
}

function createHeartShape() {
  const s = new Shape();
  const scale = 1;
  const dip = 0.55;
  const lobeY = 0.95 * scale;
  const lobeX = 1.0 * scale;
  const tipY = -1.05 * scale;

  s.moveTo(0, tipY);
  s.bezierCurveTo(
    0.55 * scale, -0.55 * scale,
    1.05 * scale, -0.1 * scale,
    lobeX, 0.4 * scale
  );
  s.bezierCurveTo(
    1.0 * scale, lobeY,
    0.55 * scale, lobeY,
    0, dip * scale
  );
  s.bezierCurveTo(
    -0.55 * scale, lobeY,
    -1.0 * scale, lobeY,
    -lobeX, 0.4 * scale
  );
  s.bezierCurveTo(
    -1.05 * scale, -0.1 * scale,
    -0.55 * scale, -0.55 * scale,
    0, tipY
  );

  return s;
}

/** Patrón "lub-dub" — dos pulsos cercanos seguidos de pausa.
 *  ~42 BPM (relajado, meditativo). El período respira ligeramente para
 *  que no se sienta robot. */
function heartbeat(t: number): number {
  const breath = 1 + Math.sin(t * 0.09) * 0.08; // BPM fluctúa lento
  const period = 1.42 * breath;
  const phase = t % period;
  const lub = Math.exp(-Math.pow((phase - 0.08) / 0.06, 2));
  const dub = Math.exp(-Math.pow((phase - 0.30) / 0.07, 2)) * 0.65;
  return lub + dub; // 0..~1.65
}

/** Onda lenta superpuesta — pulso suave de "presencia" muy lento. */
function slowWave(t: number): number {
  return (Math.sin(t * 0.22) * 0.5 + 0.5) * (Math.sin(t * 0.08) * 0.5 + 0.5);
}

/** Ripple: una onda que se expande hacia afuera del corazón cada ~5s. */
function ripple(t: number): { scale: number; opacity: number } {
  const period = 5;
  const phase = (t % period) / period; // 0..1
  const scale = 1.05 + phase * 0.65;
  const opacity =
    phase < 0.85 ? Math.pow(1 - phase / 0.85, 1.4) * 0.35 : 0;
  return { scale, opacity };
}

function HeartGeometry() {
  const heartRef = useRef<Mesh>(null);
  const haloRef = useRef<Mesh>(null);
  const rippleRef = useRef<Mesh>(null);

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
    if (!heartRef.current || !haloRef.current || !rippleRef.current) return;
    const t = clock.elapsedTime;
    const state = useSceneStore.getState();
    const progress = state.globalProgress;
    const palette = state.palette;

    const beat = heartbeat(t);
    const wave = slowWave(t);
    const rip = ripple(t);
    const beatScale = 1 + beat * (0.018 + progress * 0.03);

    const spinFactor = 0.12 + progress * 0.28;
    heartRef.current.rotation.y = t * spinFactor;
    heartRef.current.rotation.x = Math.sin(t * 0.4) * 0.14;
    heartRef.current.rotation.z = Math.sin(t * 0.27) * 0.05;
    heartRef.current.position.y = Math.sin(t * 0.55) * 0.08;

    // En suspenso (progress < 0.05) el corazón es casi invisible y lejano.
    const presence = Math.max(0, (progress - 0.05) / 0.95);
    const baseScale = 0.25 + presence * 1.05;
    heartRef.current.scale.setScalar(baseScale * beatScale);
    heartRef.current.position.z = -2 + presence * 2;
    material.emissiveIntensity +=
      (palette.starEmissive * presence - material.emissiveIntensity) * 0.06;
    material.opacity = 0.15 + presence * 0.85;
    material.transparent = true;

    // Transición a rojo hacia el final del scroll
    const red = redness(progress);
    heartColorTarget.copy(heartColorStart).lerp(heartColorEnd, red);
    heartEmissiveTarget.copy(heartEmissiveStart).lerp(heartEmissiveEnd, red);
    material.color.lerp(heartColorTarget, 0.06);
    material.emissive.lerp(heartEmissiveTarget, 0.06);
    // Reduce iridescence en estado rojo para que el rojo se sienta sólido
    material.iridescence = 0.6 - red * 0.45;
    material.sheenColor.lerp(heartEmissiveTarget, 0.04);

    // Halo principal: heartbeat + onda lenta para que no se sienta robotizado
    haloRef.current.rotation.copy(heartRef.current.rotation);
    haloRef.current.position.copy(heartRef.current.position);
    haloRef.current.position.z -= 0.18;
    const haloScale = baseScale * (1.20 + beat * 0.20 + wave * 0.06);
    haloRef.current.scale.setScalar(haloScale);
    haloMaterial.opacity =
      (0.06 + beat * 0.30 + wave * 0.10) * presence;

    // Color del halo: sigue particleB de la paleta, pero con `red` se mezcla
    // hacia el rojo del corazón para coherencia visual al final.
    haloColorTarget.copy(palette.particleB).lerp(heartEmissiveEnd, red);
    haloMaterial.color.lerp(haloColorTarget, 0.05);

    // Ripple: onda que se expande del corazón hacia afuera periódicamente.
    rippleRef.current.rotation.copy(heartRef.current.rotation);
    rippleRef.current.position.copy(heartRef.current.position);
    rippleRef.current.position.z -= 0.32;
    rippleRef.current.scale.setScalar(baseScale * rip.scale);
    rippleMaterial.opacity = rip.opacity * presence;
    rippleMaterial.color.lerp(haloColorTarget, 0.05);
  });

  return (
    <group>
      <mesh ref={rippleRef} geometry={geometry} material={rippleMaterial} />
      <mesh ref={haloRef} geometry={geometry} material={haloMaterial} />
      <mesh ref={heartRef} geometry={geometry} material={material} />
    </group>
  );
}

export function Star() {
  return <HeartGeometry />;
}
