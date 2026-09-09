import { X } from "lucide-react";
import { useJourney } from "@/hooks/useJourneyState";
import { SimulatedBadge } from "@/components/simulate/SimulatedBadge";

export function SideTaskPanel() {
  const { state, toggleSidePanel } = useJourney();
  if (!state.sidePanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={toggleSidePanel}
      />
      <div className="relative w-full max-w-md bg-dl-surface p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Need to do something else?</h3>
          <button type="button" onClick={toggleSidePanel}>
            <X size={20} />
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <div className="rounded-dl border border-dl-border p-4">
            <p className="text-sm font-medium">Upload documents</p>
            <p className="mt-1 text-xs text-dl-text-secondary">
              Drag and drop any file type. Use the paperclip on any action card.
            </p>
          </div>
          <div className="rounded-dl border border-dl-border p-4">
            <p className="text-sm font-medium">Mock face scan</p>
            <SimulatedBadge className="mt-2" />
            <button
              type="button"
              className="mt-3 rounded-dl bg-dl-brand px-4 py-2 text-sm text-white"
              data-testid="mock-face-scan"
            >
              Run biometric validation (simulated)
            </button>
          </div>
          <div className="rounded-dl border border-dl-border p-4">
            <p className="text-sm font-medium">Record verbatim quote</p>
            <p className="mt-1 text-xs text-dl-text-secondary">
              Use the microphone or video button on any capture action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
