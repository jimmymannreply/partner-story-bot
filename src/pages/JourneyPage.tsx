import { AppHeader } from "@/components/layout/AppHeader";
import { ContextBar } from "@/components/layout/ContextBar";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { RightRail } from "@/components/layout/RightRail";
import { SideTaskPanel } from "@/components/layout/SideTaskPanel";
import { StageStepper } from "@/components/layout/StageStepper";
import { StagePanel } from "@/components/journey/StagePanel";
import { useJourney } from "@/hooks/useJourneyState";

export function JourneyPage() {
  const { resetJourney, toggleSidePanel } = useJourney();

  return (
    <div className="min-h-screen bg-dl-page">
      <AppHeader onReset={resetJourney} />
      <DemoBanner />
      <ContextBar />
      <StageStepper />

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <main>
            <StagePanel />
            <button
              type="button"
              onClick={toggleSidePanel}
              className="mt-6 rounded-full border border-dl-border bg-dl-surface px-4 py-2 text-sm text-dl-text-secondary hover:bg-dl-page"
              data-testid="side-tasks-button"
            >
              Need to do something else?
            </button>
          </main>
          <RightRail />
        </div>
      </div>

      <SideTaskPanel />
    </div>
  );
}
