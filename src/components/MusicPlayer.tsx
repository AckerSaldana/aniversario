import { useEffect, useRef, useState } from 'react';
import styles from './MusicPlayer.module.css';

type Props = {
  /** URL del track. Default: /audio/music.mp3 (poner archivo en public/audio/). */
  src?: string;
  /** Volumen objetivo cuando está reproduciendo (0..1). */
  volume?: number;
  /** Texto accesible mostrado al hover. */
  label?: string;
};

const STORAGE_KEY = 'aniversario:music';
const HINT_KEY = 'aniversario:music:hint-seen';

/** Reproductor flotante minimalista — un solo botón circular en la esquina
 *  inferior izquierda. Click toggle play/pause con fade in/out. Persiste
 *  preferencia en localStorage. Loop infinito, muted por defecto al primer
 *  load (los navegadores requieren gesto del usuario para autoplay). */
export function MusicPlayer({
  src = '/audio/music.mp3',
  volume = 0.32,
  label = 'Música de fondo · The Lumineers',
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  // Hint flotante que indica "pícale" — desaparece tras el primer click,
  // recordando la decisión vía localStorage para no volver a aparecer.
  const [showHint, setShowHint] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.localStorage.getItem(HINT_KEY);
  });

  // Inicializar elemento <audio> una vez
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';

    const onCanPlay = () => setReady(true);
    const onError = () => {
      // Si el archivo no existe, dejamos el botón pero sin acción de play
      setReady(false);
    };
    audio.addEventListener('canplaythrough', onCanPlay);
    audio.addEventListener('error', onError);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('error', onError);
      cancelAnimationFrame(fadeRafRef.current);
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  const fadeTo = (target: number, duration: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(fadeRafRef.current);
    const start = performance.now();
    const startVol = audio.volume;
    const safeTarget = Math.max(0, Math.min(1, target));
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const next = startVol + (safeTarget - startVol) * t;
      // Clamp para evitar IndexSizeError por error de coma flotante
      audio.volume = Math.max(0, Math.min(1, next));
      if (t < 1) {
        fadeRafRef.current = requestAnimationFrame(step);
      } else {
        onDone?.();
      }
    };
    fadeRafRef.current = requestAnimationFrame(step);
  };

  const toggle = () => {
    // Cualquier interacción con el botón apaga el hint para siempre
    if (showHint) {
      setShowHint(false);
      localStorage.setItem(HINT_KEY, '1');
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      fadeTo(0, 700, () => audio.pause());
      setPlaying(false);
      localStorage.setItem(STORAGE_KEY, 'off');
    } else {
      audio
        .play()
        .then(() => {
          fadeTo(volume, 1200);
          setPlaying(true);
          localStorage.setItem(STORAGE_KEY, 'on');
        })
        .catch(() => {
          // Autoplay bloqueado o archivo no disponible — silencioso
        });
    }
  };

  // Si el usuario había activado música antes, intentamos restaurar (puede
  // fallar por políticas de autoplay; si falla, el botón sigue ahí).
  useEffect(() => {
    if (!ready) return;
    if (localStorage.getItem(STORAGE_KEY) === 'on' && !playing) {
      const audio = audioRef.current;
      if (!audio) return;
      audio
        .play()
        .then(() => {
          fadeTo(volume, 1200);
          setPlaying(true);
        })
        .catch(() => {
          /* silencioso — el usuario tendrá que hacer click */
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={`${styles.btn} ${playing ? styles.playing : ''} ${
          showHint ? styles.beckoning : ''
        }`}
        onClick={toggle}
        aria-label={playing ? `Silenciar — ${label}` : `Reproducir — ${label}`}
        title={label}
      >
        <NoteIcon playing={playing} />
        {/* Ondas que pulsan cuando está sonando */}
        {playing ? (
          <>
            <span className={`${styles.wave} ${styles.wave1}`} aria-hidden="true" />
            <span className={`${styles.wave} ${styles.wave2}`} aria-hidden="true" />
          </>
        ) : null}
      </button>
      {showHint && !playing ? (
        <span className={styles.hint} aria-hidden="true">
          pícale ♪
        </span>
      ) : null}
    </div>
  );
}

function NoteIcon({ playing }: { playing: boolean }) {
  // Nota musical estilizada (corchea). En estado pausado la barra diagonal
  // de "muted" se cruza encima.
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16 3.5v8.2a3.3 3.3 0 1 1-1.6-2.83V6.4l-5.6 1.4v6.2a3.3 3.3 0 1 1-1.6-2.83V5.5l8.8-2z"
        fill="currentColor"
      />
      {!playing ? (
        <path
          d="M3 17 L17 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}
