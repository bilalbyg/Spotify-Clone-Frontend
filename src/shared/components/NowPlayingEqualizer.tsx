export const NowPlayingEqualizer = () => {
  return (
    <div className="flex h-4 w-4 items-end gap-0.5">
      <div className="h-2 w-1 animate-bounce bg-green-500"></div>
      <div className="h-4 w-1 animate-bounce bg-green-500" style={{ animationDelay: '0.1s' }}></div>
      <div className="h-3 w-1 animate-bounce bg-green-500" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
};
