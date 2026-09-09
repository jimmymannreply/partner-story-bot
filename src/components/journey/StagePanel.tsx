import { useJourney } from "@/hooks/useJourneyState";
import { ActionCard } from "./ActionCard";

export function StagePanel() {
  const journey = useJourney();
  const stage = journey.stages.find((s) => s.id === journey.state.activeStageId);
  if (!stage) return null;

  const { completed, total } = journey.getStageProgress(stage.id);

  const handleNext = (actionId: string) => {
    const idx = stage.actions.findIndex((a) => a.id === actionId);
    const next = stage.actions[idx + 1];
    if (next && !journey.isActionComplete(actionId)) {
      // scroll to next
    }
  };

  return (
    <div data-testid="stage-panel">
      <div className="mb-6">
        <p className="text-sm font-medium text-dl-text-secondary">
          {stage.number} · {stage.label}
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-dl-text">
          {stage.title}
        </h2>
        <p className="mt-2 text-sm text-dl-text-secondary">
          {stage.description}
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dl-text">Your actions</h3>
        <span className="text-sm text-dl-text-secondary">
          {completed} of {total} complete
        </span>
      </div>

      <div className="space-y-4">
        {stage.actions.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            stageId={stage.id}
            isComplete={journey.isActionComplete(action.id)}
            isActive={journey.isActionActive(stage.id, action.id)}
            onActivate={() => {}}
            onNext={() => handleNext(action.id)}
          />
        ))}
      </div>
    </div>
  );
}
