import { Link } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";

interface AppHeaderProps {
  onReset?: () => void;
  showMute?: boolean;
}

export function AppHeader({ onReset, showMute = true }: AppHeaderProps) {
  const { muted, toggleMute } = useSpeech();

  return (
    <header className="border-b border-dl-border bg-dl-surface px-6 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            <div className="h-3 w-3 rounded-sm bg-[#F25022]" />
            <div className="h-3 w-3 rounded-sm bg-[#7FBA00]" />
            <div className="h-3 w-3 rounded-sm bg-[#00A4EF]" />
            <div className="h-3 w-3 rounded-sm bg-[#FFB900]" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-dl-text">
              Partner Story Bot
            </h1>
            <p className="text-xs text-dl-text-secondary">
              Guided partner evidence intake
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {showMute && (
            <button
              type="button"
              onClick={toggleMute}
              className="rounded-dl p-2 text-dl-text-secondary hover:bg-dl-page"
              aria-label={muted ? "Unmute" : "Mute"}
              data-testid="mute-button"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          )}
          <Link
            to="/"
            className="text-sm text-dl-text-secondary hover:text-dl-brand"
          >
            Home
          </Link>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="text-sm text-dl-text-secondary hover:text-dl-brand"
              data-testid="reset-journey"
            >
              Reset journey
            </button>
          )}
          <span className="rounded-full bg-dl-page px-3 py-1 text-xs text-dl-text-secondary">
            FY27 Partner Experience POC
          </span>
        </div>
      </div>
    </header>
  );
}
