import type { CSSProperties } from 'react';
import styles from './Polaroid.module.css';

type Props = {
  src: string;
  alt: string;
  caption?: string;
  rotate?: number;
  style?: CSSProperties;
  className?: string;
};

export function Polaroid({
  src,
  alt,
  caption,
  rotate = 0,
  style,
  className,
}: Props) {
  return (
    <figure
      className={`${styles.polaroid} ${className ?? ''}`}
      style={{ ...style, transform: `rotate(${rotate}deg)` }}
    >
      <div className={styles.image}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
