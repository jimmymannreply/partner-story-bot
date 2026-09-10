import { useJourneyV2 } from "@/v2/hooks/useJourneyV2";

export function V2Banner() {
  const { state, dismissBanner } = useJourneyV2();
  if (!state.showDemoBanner) return null;

  return (
    <div
      className="border-b border-me-amber/30 bg-me-amber/10 px-6 py-2 text-sm text-me-navy"
      data-testid="v2-demo-banner"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <p>
          <strong>Stakeholder demo (V2):</strong> Replaces the static nomination form with a
          no-login guided interview. OAuth, engagement picker, and scoring are add-on previews only.
        </p>
        <button
          type="button"
          onClick={dismissBanner}
          className="shrink-0 text-xs underline"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
