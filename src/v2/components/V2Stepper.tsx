import { journeyStagesV2 } from "@/v2/data/journeyStagesV2";
import { useJourneyV2 } from "@/v2/hooks/useJourneyV2";

export function V2Stepper() {
  const { state, stages, setActiveStage, getStageProgress } = useJourneyV2();
  const captureStage = stages.find((s) => s.id === "capture");
  const captureDone = captureStage
    ? getStageProgress("capture").completed
    : 0;
  const captureTotal = captureStage?.actions.length ?? 11;
  const capturePct = Math.round((captureDone / captureTotal) * 100);

  return (
    <div className="border-b border-me-line bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap gap-2 px-6 py-4">
        {journeyStagesV2.map((stage) => {
          const { completed, total } = getStageProgress(stage.id);
          const active = state.activeStageId === stage.id;
          const done = completed === total && total > 0;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(stage.id)}
              className={`rounded-lg px-4 py-2 text-left text-sm transition ${
                active
                  ? "bg-me-navy text-white"
                  : done
                    ? "bg-me-green/15 text-me-green"
                    : "bg-me-card text-me-slate hover:bg-me-ice"
              }`}
              data-testid={`v2-stage-${stage.id}`}
            >
              <span className="block text-xs opacity-80">{stage.number}</span>
              <span className="font-medium">{stage.label}</span>
            </button>
          );
        })}
      </div>
      {state.activeStageId === "capture" && (
        <div className="mx-auto max-w-5xl px-6 pb-3">
          <div className="flex items-center gap-2 text-xs text-me-slate">
            <span>Interview progress</span>
            <div className="h-1.5 flex-1 rounded-full bg-me-line">
              <div
                className="h-full rounded-full bg-me-amber transition-all"
                style={{ width: `${capturePct}%` }}
              />
            </div>
            <span>{capturePct}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
