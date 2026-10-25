import type { BoardTheme } from '../../core/types';
import { GradientASCII } from './GradientASCII';
import { Silk } from './Silk';
import { FluxLines } from './FluxLines';

interface ReactBitsBackgroundProps {
  theme: BoardTheme;
}

export function ReactBitsBackground({ theme }: ReactBitsBackgroundProps) {
  // Classic casino felts use pure CSS with zero background canvas overhead
  const isAnimatedTheme =
    theme === 'gradient-ascii' ||
    theme === 'silk' ||
    theme === 'flux-lines';

  if (!isAnimatedTheme) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {theme === 'gradient-ascii' && (
        <GradientASCII
          colors={["#1e3fd8", "#f6f8ff", "#a5d8ff", "#38bdf8"]}
          shape="horizon"
          characters=" =+xX0S8#@"
          cellSize={18}
          density={0.8}
          glyphOpacity={0.85}
          glow={0.2}
          depthOfField={0}
          flicker={0.2}
          softness={0.5}
          scale={1}
          flow={0.5}
          speed={1}
          gradientOpacity={0.9}
          grain={0.08}
          variation={0}
          mouseInteraction
          scrambleRadius={0.1}
          clickEffect="wave"
          intro
          lightMode={false}
        />
      )}

      {theme === 'silk' && (
        <Silk
          color="#5227FF"
          sheenColor="#ffffff"
          speed={5}
          scale={1}
          rotation={0}
          sheen={0.5}
          depth={0.5}
          glow={0.3}
          noiseIntensity={1.5}
          mouseInteraction
          clickRipple
          intro
          ripple={1}
          wave={1}
          variation={0}
          interactionStrength={1}
          fade={0}
          lightMode={false}
        />
      )}

      {theme === 'flux-lines' && (
        <FluxLines
          colors={["#ffffff", "#ffffff", "#ffffff"]}
          glow={2}
          rimWidth={0.2}
          lineWidth={1}
          flowDirection="down"
          mouseInteraction
          clickSwirl
          speed={0.5}
          scale={1.6}
          turbulence={1}
          fluidity={0.1}
          sharpness={2.5}
          shimmer={1.5}
          mouseStrength={1}
          mouseRadius={0.35}
          intro
          lightMode={false}
        />
      )}
    </div>
  );
}

export default ReactBitsBackground;
