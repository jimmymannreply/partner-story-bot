import { useJourney } from "@/hooks/useJourneyState";

export function ContextBar() {
  const { state, profile, stages } = useJourney();
  const stage = stages.find((s) => s.id === state.activeStageId);

  const scenario =
    state.selectedEngagement?.name ||
    state.customEngagement ||
    "Not selected yet";

  return (
    <div
      className="border-b border-dl-border bg-dl-surface px-6 py-2.5"
      data-testid="context-bar"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between text-sm">
        <div className="flex flex-wrap gap-6">
          <div>
            <span className="text-dl-text-secondary">Partner </span>
            <span className="font-medium text-dl-text">
              {state.signedIn ? profile.companyName : "—"}
            </span>
          </div>
          <div>
            <span className="text-dl-text-secondary">Role </span>
            <span className="font-medium text-dl-text">{profile.role}</span>
          </div>
          <div>
            <span className="text-dl-text-secondary">Engagement </span>
            <span className="font-medium text-dl-text">{scenario}</span>
          </div>
          <div>
            <span className="text-dl-text-secondary">Current stage </span>
            <span className="font-medium text-dl-brand">
              {stage?.title ?? "—"}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="text-sm text-dl-brand hover:underline"
        >
          Edit context
        </button>
      </div>
    </div>
  );
}
