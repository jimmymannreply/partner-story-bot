import { cn } from "@/lib/utils";
import { useJourney } from "@/hooks/useJourneyState";

export function StageStepper() {
  const { state, stages, setActiveStage, getStageProgress } = useJourney();

  return (
    <div className="px-6 py-4" data-testid="stage-stepper">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-4">
        {stages.map((stage) => {
          const { completed, total } = getStageProgress(stage.id);
          const isActive = state.activeStageId === stage.id;
          const isDone = completed === total && total > 0;

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(stage.id)}
              className={cn(
                "rounded-dl border bg-dl-surface p-4 text-left transition-shadow",
                isActive
                  ? "border-dl-brand shadow-stage-active"
                  : "border-dl-border shadow-card hover:border-dl-brand/40",
                isDone && !isActive && "opacity-80"
              )}
              data-testid={`stage-${stage.id}`}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-dl-text-secondary">
                {stage.number} · {stage.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-dl-text">
                {stage.title}
              </p>
              <p className="mt-1 text-xs text-dl-text-secondary">
                {completed} of {total} complete
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
