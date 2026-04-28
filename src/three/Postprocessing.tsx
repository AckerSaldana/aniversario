import { EffectComposer, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

type Props = {
  enabled?: boolean;
};

export function Postprocessing({ enabled = true }: Props) {
  if (!enabled) return null;
  return (
    <EffectComposer>
      <Vignette eskil={false} offset={0.3} darkness={0.45} />
      <Noise opacity={0.04} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
}
