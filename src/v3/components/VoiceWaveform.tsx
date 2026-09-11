export function VoiceWaveform({ active }: { active: boolean }) {
  return (
    <div
      className="flex h-10 items-end justify-center gap-1"
      data-testid="voice-waveform"
      aria-hidden
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className={`w-1 rounded-full bg-me-amber transition-all ${
            active ? "animate-pulse" : "opacity-30"
          }`}
          style={{
            height: active ? `${12 + ((i * 7) % 24)}px` : "8px",
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}
