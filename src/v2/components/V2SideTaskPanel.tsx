import { useState } from "react";
import { X } from "lucide-react";
import { VideoRecorder } from "@/components/capture/VideoRecorder";
import { SimulatedBadge } from "@/components/simulate/SimulatedBadge";
import { useJourneyV2 } from "@/v2/hooks/useJourneyV2";

export function V2SideTaskPanel() {
  const { state, toggleSidePanel } = useJourneyV2();
  const [sideVideoUrl, setSideVideoUrl] = useState<string | null>(null);
  if (!state.sidePanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={toggleSidePanel} />
      <div className="relative w-full max-w-md bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-me-navy">Need to do something else?</h3>
          <button type="button" onClick={toggleSidePanel} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-me-line p-4">
            <p className="text-sm font-medium text-me-navy">Upload documents</p>
            <p className="mt-1 text-xs text-me-slate">
              Use the paperclip on any interview step. After upload, a PII badge appears
              (simulated).
            </p>
            <SimulatedBadge className="mt-2" />
            <p className="mt-2 text-xs text-me-amber">
              PII scan complete — 2 items redacted
            </p>
          </div>
          <div className="rounded-lg border border-me-line p-4">
            <p className="text-sm font-medium text-me-navy">Record verbatim quote</p>
            <p className="mt-1 text-xs text-me-slate">
              Record a short video or voice clip without leaving the interview.
            </p>
            <div className="mt-3">
              <VideoRecorder
                onRecordingComplete={(_blob, url) => setSideVideoUrl(url)}
              />
            </div>
            {sideVideoUrl && (
              <p className="mt-2 text-xs text-me-green">Verbatim clip saved for this session.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
