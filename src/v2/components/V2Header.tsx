import { Link } from "react-router-dom";
import { useSpeech } from "@/hooks/useSpeech";

interface Props {
  onReset: () => void;
}

export function V2Header({ onReset }: Props) {
  const { muted, toggleMute } = useSpeech();

  return (
    <header className="border-b border-me-line bg-me-navy-dark px-6 py-3 text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div>
          <p className="font-serif text-lg">Partner Story Bot</p>
          <p className="text-xs text-me-ice/70">V2 — No-login core demo</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link
            to={import.meta.env.VITE_V2_STANDALONE ? "/" : "/v2"}
            className="text-me-ice hover:underline"
          >
            Home
          </Link>
          {!import.meta.env.VITE_V2_STANDALONE && (
            <Link to="/" className="text-me-ice/70 hover:underline">V1 demo</Link>
          )}
          <button type="button" onClick={toggleMute} className="text-me-ice">
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded border border-me-line/40 px-2 py-1 text-xs"
          >
            Reset
          </button>
        </div>
      </div>
    </header>
  );
}
