import equalizerAnimatedGreen from '@/assets/equaliser-animated-green.f5eb96f2.gif';

type NowPlayingEqualizerProps = {
  className?: string;
};

export function NowPlayingEqualizer({ className = 'h-4 w-4' }: NowPlayingEqualizerProps) {
  return <img src={equalizerAnimatedGreen} alt="" aria-hidden="true" className={className} />;
}
