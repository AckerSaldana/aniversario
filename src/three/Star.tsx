import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {
  ExtrudeGeometry,
  MeshPhysicalMaterial,
  Shape,
  type Group,
  type Mesh,
} from 'three';
import { useSceneStore } from './store';

const OBJ_URL = '/models/grulla.obj';

// Material protagonista: rose suave con clearcoat e iridescencia, transmission
// ligera para que respire luz (especialmente bonito en fondo cream).
const material = new MeshPhysicalMaterial({
  color: '#e8b4b8',
  roughness: 0.22,
  metalness: 0.18,
  clearcoat: 1.0,
  clearcoatRoughness: 0.08,
  iridescence: 0.85,
  iridescenceIOR: 1.4,
  iridescenceThicknessRange: [120, 480],
  sheen: 0.6,
  sheenColor: '#e8c56b',
  sheenRoughness: 0.4,
  transmission: 0.15,
  thickness: 0.6,
  ior: 1.45,
  attenuationColor: '#c97b84',
  attenuationDistance: 4,
  emissive: '#ffc15c',
  emissiveIntensity: 0.05,
});

function createStarShape({
  outerRadius = 1,
  innerRadius = 0.42,
  points = 5,
} = {}) {
  const shape = new Shape();
  const total = points * 2;
  for (let i = 0; i <= total; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const a = (i / total) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

function StarGeometry() {
  const ref = useRef<Mesh>(null);

  const geometry = useMemo(() => {
    const shape = createStarShape({ outerRadius: 1, innerRadius: 0.42, points: 5 });
    const geom = new ExtrudeGeometry(shape, {
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.08,
      bevelOffset: 0,
      bevelSegments: 6,
      curveSegments: 16,
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
    const spinFactor = 0.18 + progress * 0.4;
    ref.current.rotation.y = t * spinFactor;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.18;
    ref.current.rotation.z = Math.sin(t * 0.27) * 0.06;
    ref.current.position.y = Math.sin(t * 0.55) * 0.1;
    ref.current.scale.setScalar(0.6 + progress * 0.85);
    material.emissiveIntensity +=
      (palette.starEmissive - material.emissiveIntensity) * 0.06;
  });

  return <mesh ref={ref} geometry={geometry} material={material} />;
}

function StarOBJ() {
  const obj = useLoader(OBJLoader, OBJ_URL);
  const ref = useRef<Group>(null);

  useEffect(() => {
    obj.traverse((child) => {
      const m = child as Mesh;
      if (m.isMesh) {
        m.material = material;
        m.geometry.computeVertexNormals();
      }
    });
  }, [obj]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const state = useSceneStore.getState();
    const progress = state.globalProgress;
    const palette = state.palette;
    const spinFactor = 0.18 + progress * 0.4;
    ref.current.rotation.y = t * spinFactor;
    ref.current.position.y = Math.sin(t * 0.55) * 0.1;
    ref.current.scale.setScalar(0.6 + progress * 0.85);
    material.emissiveIntensity +=
      (palette.starEmissive - material.emissiveIntensity) * 0.06;
  });

  return <primitive ref={ref} object={obj} />;
}

export function Star() {
  const [hasModel, setHasModel] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(OBJ_URL, { method: 'HEAD' })
      .then((r) => {
        if (!r.ok) return false;
        const ct = r.headers.get('content-type') ?? '';
        return !ct.includes('text/html');
      })
      .then((ok) => !cancelled && setHasModel(ok))
      .catch(() => !cancelled && setHasModel(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return hasModel ? <StarOBJ /> : <StarGeometry />;
}
