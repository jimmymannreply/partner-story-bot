import { V2ActionCard } from "@/v2/components/V2ActionCard";
import { useJourneyV2 } from "@/v2/hooks/useJourneyV2";

export function V2StagePanel() {
  const { state, stages } = useJourneyV2();
  const stage = stages.find((s) => s.id === state.activeStageId) ?? stages[0];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-me-amber">
          {stage.number} · {stage.label}
        </p>
        <h2 className="font-serif text-2xl text-me-navy">{stage.title}</h2>
        <p className="text-sm text-me-slate">{stage.description}</p>
      </div>
      <div className="space-y-3">
        {stage.actions.map((action) => (
          <V2ActionCard key={action.id} action={action} stageId={stage.id} />
        ))}
      </div>
    </div>
  );
}
