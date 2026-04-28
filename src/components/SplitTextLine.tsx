import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

type Props = {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  type?: 'chars' | 'lines' | 'words';
  className?: string;
  triggerStart?: string;
  stagger?: number;
  delay?: number;
  /** activa float ambiente sutil después de la entrada (chars/words) */
  ambient?: boolean;
};

export function SplitTextLine({
  children,
  as = 'p',
  type = 'lines',
  className,
  triggerStart = 'top 80%',
  stagger,
  delay = 0,
  ambient = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as 'p';

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const splitType =
        type === 'chars' ? 'words,chars' : type === 'words' ? 'words' : 'lines';

      const split = SplitText.create(el, {
        type: splitType,
        mask: type === 'lines' ? 'lines' : undefined,
        linesClass: 'split-line',
        wordsClass: 'split-word',
      });

      const target =
        type === 'lines' ? split.lines : type === 'words' ? split.words : split.chars;

      const baseStagger =
        stagger ?? (type === 'chars' ? 0.022 : type === 'words' ? 0.05 : 0.08);

      gsap.set(target, {
        transformOrigin: type === 'chars' ? '50% 100%' : '0% 50%',
        transformPerspective: 800,
      });

      const tween = gsap.from(target, {
        y: type === 'chars' ? '70%' : '110%',
        rotateX: type === 'chars' ? -55 : 0,
        skewY: type === 'lines' ? 6 : 0,
        opacity: 0,
        duration: type === 'chars' ? 1.0 : 1.2,
        ease: 'expo.out',
        stagger: baseStagger,
        delay,
        scrollTrigger: {
          trigger: el,
          start: triggerStart,
          toggleActions: 'play none none reverse',
        },
        onComplete: () => {
          if (!ambient || (type !== 'chars' && type !== 'words')) return;
          // Float ambiente: empieza solo cuando la entrada termina, así
          // no compite con el tween de entrada por la misma propiedad y.
          gsap.to(target, {
            y: type === 'chars' ? -2 : -3,
            duration: 2.4,
            ease: 'sine.inOut',
            stagger: { each: 0.06, from: 'random' },
            repeat: -1,
            yoyo: true,
          });
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.killTweensOf(target);
        split.revert();
      };
    },
    { scope: ref }
  );

  return (
    <Tag
      ref={ref as React.RefObject<HTMLParagraphElement>}
      className={className}
    >
      {children}
    </Tag>
  );
}
