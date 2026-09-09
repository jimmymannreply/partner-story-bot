import { useJourney } from "@/hooks/useJourneyState";
import { useSpeech } from "@/hooks/useSpeech";
import { stageRailCopy } from "@/data/interviewScript";
import { questionGuidance } from "@/data/questionGuidance";

const SUGGESTED_PROMPTS = [
  "What should I do next?",
  "What does good look like here?",
  "Can I skip this step?",
];

export function RightRail() {
  const { state, stages, setFocusedAction } = useJourney();
  const { speak } = useSpeech();
  const stage = stages.find((s) => s.id === state.activeStageId);
  const copy = stageRailCopy[state.activeStageId] ?? stageRailCopy.collect;

  const activeAction =
    stage?.actions.find((a) => a.id === state.focusedActionId) ??
    stage?.actions.find((a) => !state.completedActions.has(a.id));

  const guidance = activeAction
    ? questionGuidance[activeAction.id]
    : null;

  const handlePrompt = (prompt: string) => {
    const response =
      prompt === "What should I do next?"
        ? guidance?.tip ?? copy.jamieHint
        : prompt === "What does good look like here?"
          ? guidance?.lookingFor ?? copy.rationale
          : "You can skip optional steps, but completing them improves your evidence score.";
    speak(response);
  };

  return (
    <aside className="space-y-4" data-testid="right-rail">
      {activeAction && guidance && (
        <div className="rounded-dl border border-dl-brand/30 bg-blue-50/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-dl-brand">
            Current question
          </p>
          <h4 className="mt-1 text-sm font-semibold text-dl-text">
            {activeAction.title}
          </h4>
          <p className="mt-2 text-sm text-dl-text">
            <span className="font-medium">What we're looking for: </span>
            {guidance.lookingFor}
          </p>
          <p className="mt-2 text-xs text-dl-text-secondary">{guidance.tip}</p>
          <button
            type="button"
            className="mt-2 text-xs text-dl-brand hover:underline"
            onClick={() =>
              document
                .querySelector(`[data-testid="action-${activeAction.id}"]`)
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Take me there
          </button>
        </div>
      )}

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

      {stage && (
        <div className="rounded-dl border border-dl-border bg-dl-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-dl-text-secondary">
            Questions in this stage
          </p>
          <ul className="mt-2 space-y-1">
            {stage.actions.map((a) => {
              const g = questionGuidance[a.id];
              const isActive = activeAction?.id === a.id;
              const isDone = state.completedActions.has(a.id);
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setFocusedAction(a.id);
                      document
                        .querySelector(`[data-testid="action-${a.id}"]`)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full rounded px-2 py-1.5 text-left text-xs ${
                      isActive
                        ? "bg-dl-brand/10 font-medium text-dl-brand"
                        : isDone
                          ? "text-dl-success"
                          : "text-dl-text-secondary hover:bg-dl-page"
                    }`}
                  >
                    {isDone ? "✓ " : ""}
                    {a.title}
                  </button>
                  {isActive && g && (
                    <p className="px-2 pb-1 text-xs text-dl-text-secondary">
                      {g.lookingFor}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="rounded-dl border border-dl-border bg-dl-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-dl-text-secondary">
          Ask about your current stage
        </p>
        <div className="mt-3 flex items-start gap-3">
          <img
            src={`${import.meta.env.BASE_URL}jamie-avatar.jpg`}
            alt="Jamie"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex-1 rounded-dl bg-dl-page p-3 text-sm text-dl-text">
            {activeAction && guidance
              ? `For "${activeAction.title}": ${guidance.lookingFor}`
              : copy.jamieHint}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePrompt(p)}
              className="rounded-full border border-dl-border px-3 py-1 text-xs hover:bg-dl-page"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
