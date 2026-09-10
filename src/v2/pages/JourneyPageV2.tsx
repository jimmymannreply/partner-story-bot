import { V2SideTaskPanel } from "@/v2/components/V2SideTaskPanel";
import { AddonDrawer } from "@/v2/components/AddonDrawer";
import { V2Banner } from "@/v2/components/V2Banner";
import { V2Header } from "@/v2/components/V2Header";
import { V2StagePanel } from "@/v2/components/V2StagePanel";
import { V2Stepper } from "@/v2/components/V2Stepper";
import { useJourneyV2 } from "@/v2/hooks/useJourneyV2";

export function JourneyPageV2() {
  const { resetJourney, toggleSidePanel } = useJourneyV2();

  return (
    <div className="min-h-screen bg-me-card">
      <V2Header onReset={resetJourney} />
      <V2Banner />
      <V2Stepper />

      <div className="mx-auto max-w-3xl px-6 py-8">
        <V2StagePanel />
        <button
          type="button"
          onClick={toggleSidePanel}
          className="mt-6 rounded-full border-2 border-me-amber bg-white px-4 py-2 text-sm font-medium text-me-amber"
          data-testid="v2-side-tasks"
        >
          Need to do something else?
        </button>
      </div>

      <V2SideTaskPanel />
      <AddonDrawer />
    </div>
  );
}
