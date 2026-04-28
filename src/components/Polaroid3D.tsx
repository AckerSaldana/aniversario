import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useVideoTexture } from '@react-three/drei';
import {
  CanvasTexture,
  type Group,
  LinearFilter,
  LinearMipmapLinearFilter,
  MathUtils,
  SRGBColorSpace,
  type Texture,
  TextureLoader,
} from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Polaroid } from './Polaroid';
import styles from './Polaroid3D.module.css';

type Props = {
  src: string;
  alt: string;
  /** URL opcional de video (mp4/webm). Si está, el polaroid se vuelve "live"
   *  y reproduce el clip en loop al pasar el cursor encima. El modal de zoom
   *  también lo reproduce en lugar de la imagen. */
  video?: string;
  rotate?: number;
  caption?: string;
  /** Ancho del polaroid en CSS (default 200px) */
  width?: number;
  className?: string;
};

/**
 * Polaroid 3D con su propio <Canvas> independiente. Tilt + lift con el
 * cursor; click → abre un modal HTML con la foto en grande (vía portal).
 *
 * El modal NO clona el Canvas 3D — usa <img> + CSS para evitar el costo
 * de un segundo WebGL context y para que NO afecte el layout del grid
 * cuando se abre/cierra (el polaroid 3D original se queda en su lugar).
 *
 * En lowFi (mobile / reduced motion) cae al <Polaroid> 2D estático.
 */
export function Polaroid3D({
  src,
  alt,
  video,
  rotate = 0,
  caption,
  width = 200,
  className,
}: Props) {
  const { lowFi } = useReducedMotion();
  const [zoomed, setZoomed] = useState(false);

  if (lowFi) {
    return (
      <Polaroid
        src={src}
        alt={alt}
        rotate={rotate}
        caption={caption}
        className={className}
      />
    );
  }

  const aspect = 2.35 / 1.55; // ≈ 1.516
  const mountStyle = { width: `${width}px`, height: `${width * aspect}px` };

  return (
    <>
      <figure
        className={`${styles.mount} ${className ?? ''}`}
        style={mountStyle}
        onClick={() => setZoomed(true)}
      >
        <Canvas
          className={styles.canvas}
          dpr={[2, 3]}
          gl={{ antialias: true, alpha: true, premultipliedAlpha: true }}
          camera={{ position: [0, 0, 5.2], fov: 30 }}
        >
          <ambientLight intensity={0.6} color="#fff5d6" />
          <directionalLight position={[2.5, 3, 4]} intensity={1.3} color="#ffefd6" />
          <directionalLight position={[-2, -1, 2]} intensity={0.4} color="#e8b4b8" />
          <PolaroidErrorBoundary
            fallback={<PaperOnly rotate={rotate} caption={caption} />}
          >
            <Suspense
              fallback={<PaperOnly rotate={rotate} caption={caption} />}
            >
              <PolaroidMesh
                src={src}
                video={video}
                rotate={rotate}
                caption={caption}
              />
            </Suspense>
          </PolaroidErrorBoundary>
        </Canvas>
        <span className={styles.srOnly}>{alt}</span>
      </figure>

      {zoomed ? (
        <ZoomModal
          src={src}
          alt={alt}
          video={video}
          caption={caption}
          onClose={() => setZoomed(false)}
        />
      ) : null}
    </>
  );
}

/**
 * Modal HTML que muestra la foto en grande, vía createPortal a document.body
 * para escapar de cualquier ancestro con stacking context o transforms.
 */
function ZoomModal({
  src,
  alt,
  video,
  caption,
  onClose,
}: {
  src: string;
  alt: string;
  video?: string;
  caption?: string;
  onClose: () => void;
}) {
  // Live picture: el video se reproduce UNA vez al abrir el modal y al
  // terminar dejamos la foto estática en su lugar (igual a iOS Live Photo).
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const showVideo = !!video && !videoEnded;

  return createPortal(
    <div
      className={styles.zoomOverlay}
      onClick={onClose}
      role="dialog"
      aria-label={alt}
    >
      <figure
        className={styles.zoomFrame}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.zoomPhoto}>
          {showVideo ? (
            <video
              key={video}
              src={video}
              poster={src}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={() => setVideoEnded(true)}
            />
          ) : (
            <img src={src} alt={alt} />
          )}
        </div>
        {caption ? (
          <figcaption className={styles.zoomCaption}>{caption}</figcaption>
        ) : null}
      </figure>
      <button
        type="button"
        className={styles.zoomClose}
        onClick={onClose}
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>,
    document.body
  );
}

function PolaroidMesh({
  src,
  video,
  rotate,
  caption,
}: {
  src: string;
  video?: string;
  rotate: number;
  caption?: string;
}) {
  // Si hay video usamos el sub-componente con useVideoTexture (drei).
  // Si no, mostramos la imagen estática directamente.
  return video ? (
    <LivePolaroidMesh
      video={video}
      rotate={rotate}
      caption={caption}
      fallbackSrc={src}
    />
  ) : (
    <StaticPolaroidMesh src={src} rotate={rotate} caption={caption} />
  );
}

function StaticPolaroidMesh({
  src,
  rotate,
  caption,
}: {
  src: string;
  rotate: number;
  caption?: string;
}) {
  const groupRef = useRef<Group>(null);
  const imgTex = useLoader(TextureLoader, src, (loader) => {
    (loader as TextureLoader).crossOrigin = 'anonymous';
  }) as Texture;
  imgTex.colorSpace = SRGBColorSpace;
  imgTex.anisotropy = 16;
  imgTex.minFilter = LinearMipmapLinearFilter;
  imgTex.magFilter = LinearFilter;
  imgTex.generateMipmaps = true;
  imgTex.needsUpdate = true;

  useTiltAndBob(groupRef, rotate);

  const baseRotZ = MathUtils.degToRad(rotate);

  return (
    <group ref={groupRef} rotation={[0, 0, baseRotZ]}>
      <PolaroidPaper texture={imgTex} caption={caption} />
    </group>
  );
}

function LivePolaroidMesh({
  video,
  rotate,
  caption,
}: {
  video: string;
  rotate: number;
  caption?: string;
  fallbackSrc: string;
}) {
  const groupRef = useRef<Group>(null);

  // useVideoTexture maneja: crear el <video>, pre-cargarlo, autoplay,
  // suspend hasta que tenga al menos un frame. Si falla, lanza al
  // ErrorBoundary y mostramos el PaperOnly fallback.
  const videoTex = useVideoTexture(video, {
    crossOrigin: 'anonymous',
    muted: true,
    loop: true,
    playsInline: true,
    start: true,
  });
  videoTex.colorSpace = SRGBColorSpace;
  videoTex.anisotropy = 16;
  videoTex.minFilter = LinearFilter;
  videoTex.magFilter = LinearFilter;
  videoTex.generateMipmaps = false;

  useTiltAndBob(groupRef, rotate);

  const baseRotZ = MathUtils.degToRad(rotate);

  return (
    <group ref={groupRef} rotation={[0, 0, baseRotZ]}>
      <PolaroidPaper texture={videoTex} caption={caption} />
    </group>
  );
}

/** Hook compartido: tilt con cursor + bob ambiente + lift en hover.
 *  Se re-usa entre StaticPolaroidMesh y LivePolaroidMesh. */
function useTiltAndBob(groupRef: React.RefObject<Group | null>, rotate: number) {
  const baseRotZ = MathUtils.degToRad(rotate);
  const phase = useRef(Math.random() * Math.PI * 2).current;

  useFrame(({ pointer, clock }) => {
    if (!groupRef.current) return;

    const t = clock.elapsedTime;
    const ambient = Math.sin(t * 0.55 + phase) * 0.018;

    const px = pointer.x;
    const py = pointer.y;
    const inside =
      Math.abs(px) <= 1 && Math.abs(py) <= 1 && (px !== 0 || py !== 0);

    const tx = -py * 0.22;
    const ty = px * 0.32;
    const tz = baseRotZ + ambient;
    const lift = inside ? 0.35 : 0;

    const k = 0.14;
    groupRef.current.rotation.x += (tx - groupRef.current.rotation.x) * k;
    groupRef.current.rotation.y += (ty - groupRef.current.rotation.y) * k;
    groupRef.current.rotation.z += (tz - groupRef.current.rotation.z) * k;
    groupRef.current.position.z += (lift - groupRef.current.position.z) * k;
  });
}

function PolaroidPaper({
  texture,
  caption,
}: {
  texture: Texture | null;
  caption?: string;
}) {
  const bodyW = 1.3;
  const bodyH = 1.97;
  const photoW = 1.16;
  const photoH = 1.36;
  const photoY = 0.25;
  const thickness = 0.04;

  const captionY = -0.7;
  const captionW = bodyW * 0.85;
  const captionH = 0.28;

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[bodyW, bodyH, thickness]} />
        <meshPhysicalMaterial
          color="#f5efe6"
          roughness={0.88}
          metalness={0}
          sheen={0.3}
          sheenColor="#fff5d6"
          clearcoat={0.05}
        />
      </mesh>

      <mesh position={[0, photoY, thickness / 2 + 0.001]}>
        <planeGeometry args={[photoW, photoH]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            roughness={0.55}
            metalness={0}
            toneMapped={false}
          />
        ) : (
          <meshBasicMaterial color="#2a1f1a" toneMapped={false} />
        )}
      </mesh>

      {caption ? (
        <SharpieCaption
          text={caption}
          width={captionW}
          height={captionH}
          y={captionY}
          z={thickness / 2 + 0.002}
        />
      ) : null}
    </>
  );
}

function SharpieCaption({
  text,
  width,
  height,
  y,
  z,
}: {
  text: string;
  width: number;
  height: number;
  y: number;
  z: number;
}) {
  const [tex, setTex] = useState<CanvasTexture | null>(() =>
    makeCaptionTexture(text)
  );

  useEffect(() => {
    if (!('fonts' in document)) return;
    const fontSpec = '700 64px "Caveat Variable", Caveat, cursive';
    document.fonts.load(fontSpec, text).then(() => {
      setTex(makeCaptionTexture(text));
    });
  }, [text]);

  const rotZ = useMemo(() => MathUtils.degToRad(-2.5), []);

  if (!tex) return null;

  return (
    <mesh position={[0, y, z]} rotation={[0, 0, rotZ]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function makeCaptionTexture(text: string): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '700 360px "Caveat Variable", Caveat, "Comic Sans MS", cursive';
  ctx.fillStyle = '#2a1f1a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const total = text.length;
  const stepX = canvas.width / (total + 2);
  let cursorX = stepX * 1.5;
  for (let i = 0; i < total; i++) {
    const ch = text[i];
    const dy = (Math.sin(i * 1.7) * 8) | 0;
    const angle = ((i % 2 === 0 ? -1 : 1) * 0.012) + Math.sin(i) * 0.008;
    ctx.save();
    ctx.translate(cursorX, canvas.height / 2 + dy);
    ctx.rotate(angle);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    cursorX += ctx.measureText(ch).width + 12;
  }
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 16;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.magFilter = LinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

function PaperOnly({ rotate, caption }: { rotate: number; caption?: string }) {
  const baseRotZ = MathUtils.degToRad(rotate);
  return (
    <group rotation={[0, 0, baseRotZ]}>
      <PolaroidPaper texture={null} caption={caption} />
    </group>
  );
}

class PolaroidErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Silenciar — el fallback se muestra. Si quieres logging, hookéalo aquí.
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
