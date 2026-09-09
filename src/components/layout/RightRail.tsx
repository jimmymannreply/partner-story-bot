import { useJourney } from "@/hooks/useJourneyState";
import { useSpeech } from "@/hooks/useSpeech";
import { stageRailCopy } from "@/data/interviewScript";

const SUGGESTED_PROMPTS = [
  "What should I do next?",
  "What does good look like here?",
  "Can I skip this step?",
];

export function RightRail() {
  const { state, stages } = useJourney();
  const { speak } = useSpeech();
  const stage = stages.find((s) => s.id === state.activeStageId);
  const copy = stageRailCopy[state.activeStageId] ?? stageRailCopy.collect;

  const handlePrompt = (prompt: string) => {
    const response =
      prompt === "What should I do next?"
        ? copy.jamieHint
        : prompt === "What does good look like here?"
          ? copy.rationale
          : "You can skip optional steps, but completing them improves your evidence score.";
    speak(response);
  };

  const activeAction = stage?.actions.find(
    (a) => !state.completedActions.has(a.id)
  );

  return (
    <aside className="space-y-4" data-testid="right-rail">
      <div className="rounded-dl border border-dl-border bg-dl-page/50 p-4 text-sm text-dl-text-secondary">
        {copy.rationale}
      </div>

      <div className="rounded-dl border border-dl-border bg-dl-surface p-4">
        <h4 className="text-sm font-semibold text-dl-text">
          What does Microsoft provide?
        </h4>
        <p className="mt-2 text-sm text-dl-text-secondary">
          {copy.microsoftProvides}
        </p>
      </div>

      <div className="rounded-dl border border-dl-border bg-dl-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-dl-text-secondary">
          Ask about your current stage
        </p>
        <div className="mt-3 flex items-start gap-3">
          <img
            src="/jamie-avatar.jpg"
            alt="Jamie"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex-1 rounded-dl bg-dl-page p-3 text-sm text-dl-text">
            {activeAction
              ? `Let's work on "${activeAction.title}". ${copy.jamieHint}`
              : copy.jamieHint}
            {activeAction && (
              <button
                type="button"
                className="mt-2 text-dl-brand hover:underline"
                onClick={() =>
                  document
                    .querySelector(`[data-testid="action-${activeAction.id}"]`)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Take me there
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePrompt(p)}
              className="rounded-full border border-dl-border px-3 py-1 text-xs hover:bg-dl-page"
              data-testid={`prompt-${p.slice(0, 10)}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
