import type { V2Action } from "@/v2/data/journeyStagesV2";
import { V2ActionInput } from "@/v2/components/V2ActionInput";
import { useJourneyV2 } from "@/v2/hooks/useJourneyV2";

interface Props {
  action: V2Action;
  stageId: string;
}

export function V2ActionCard({ action, stageId }: Props) {
  const journey = useJourneyV2();
  const complete = journey.isActionComplete(action.id);
  const active = journey.isActionActive(stageId, action.id);

  return (
    <div
      className={`rounded-lg border bg-white p-4 ${
        active ? "border-me-navy shadow-md" : "border-me-line"
      } ${complete ? "opacity-80" : ""}`}
      data-testid={`v2-action-${action.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          {action.stepLabel && (
            <span className="text-xs font-semibold text-me-amber">
              Step {action.stepLabel}
            </span>
          )}
          <h3 className="font-serif text-lg text-me-navy">{action.title}</h3>
          <p className="text-sm text-me-slate">{action.description}</p>
        </div>
        {complete && (
          <span className="rounded bg-me-green/15 px-2 py-0.5 text-xs text-me-green">
            Complete
          </span>
        )}
      </div>
      {(active || complete) && <V2ActionInput action={action} />}
    </div>
  );
}
