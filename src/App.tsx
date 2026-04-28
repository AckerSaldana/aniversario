import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Scene } from './three/Scene';
import { useLenis } from './hooks/useLenis';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useGlobalScroll } from './hooks/useGlobalScroll';
import { CosmosBackdrop } from './components/CosmosBackdrop';
import { MusicPlayer } from './components/MusicPlayer';
import { ProgressIndicator } from './components/ProgressIndicator';
import { Chapter00Hero } from './chapters/Chapter00Hero';
import { Chapter01Vichy } from './chapters/Chapter01Vichy';
import { Chapter02Museos } from './chapters/Chapter02Museos';
import { Chapter03Mosaico } from './chapters/Chapter03Mosaico';
import { Chapter04Travesias } from './chapters/Chapter04Travesias';
import { Chapter05Presente } from './chapters/Chapter05Presente';
import { Chapter06Futuro } from './chapters/Chapter06Futuro';

function App() {
  const { lowFi, reduced } = useReducedMotion();
  useLenis(!reduced);
  useGlobalScroll(!reduced);

  return (
    <>
      <CosmosBackdrop />

      <div className="scene-canvas">
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 7.5], fov: 32 }}
        >
          <Suspense fallback={null}>
            <Scene postprocessing={!lowFi} />
          </Suspense>
        </Canvas>
      </div>

      <ProgressIndicator />
      <MusicPlayer />

      <main className="story">
        <Chapter00Hero />
        <Chapter01Vichy />
        <Chapter02Museos />
        <Chapter03Mosaico />
        <Chapter04Travesias />
        <Chapter05Presente />
        <Chapter06Futuro />
      </main>
    </>
  );
}

export default App;
