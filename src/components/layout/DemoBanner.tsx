import { X } from "lucide-react";
import { useJourney } from "@/hooks/useJourneyState";

export function DemoBanner() {
  const { state, dismissBanner } = useJourney();
  if (!state.showDemoBanner) return null;

  return (
    <div
      className="flex items-center justify-between bg-dl-warning-bg px-6 py-2 text-sm text-dl-warning"
      data-testid="demo-banner"
    >
      <span>
        This is a stakeholder demo. OAuth, Skilling Hub, sales data, and
        scoring are simulated and labeled.
      </span>
      <button
        type="button"
        onClick={dismissBanner}
        aria-label="Dismiss"
        className="rounded p-1 hover:bg-dl-warning/10"
      >
        <X size={16} />
      </button>
    </div>
  );
}
