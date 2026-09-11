import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";
import { AddonPreviewDrawer } from "@/v3/components/AddonPreviewDrawer";
import { OptionPreviewDrawer } from "@/v3/components/OptionPreviewDrawer";
import { VoiceFirstInput } from "@/v3/components/VoiceFirstInput";
import { useJourneyV3 } from "@/v3/hooks/useJourneyV3";

const v3Standalone = import.meta.env.VITE_V3_STANDALONE === "true";
const submissionsPath = v3Standalone ? "/submissions" : "/v3/submissions";

export function JourneyPageV3() {
  const journey = useJourneyV3();
  const { speak } = useSpeech();
  const navigate = useNavigate();
  const { state, steps } = journey;
  const step = steps[state.interviewStep];
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (state.screen === "landing") {
      journey.startJourney();
    }
  }, [state.screen, journey]);

  useEffect(() => {
    if (state.screen !== "interview" || !step) return;
    const saved = state.responses[step.id]?.value ?? "";
    setAnswer(saved);
    speak(step.prompt);
  }, [state.screen, state.interviewStep, step, speak, state.responses]);

  const progress =
    state.screen === "interview"
      ? Math.round(((state.interviewStep + 1) / steps.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-me-card">
      <header className="border-b border-me-line bg-me-navy-dark px-6 py-3 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <p className="font-serif text-lg">Voice-first interview</p>
          <button type="button" onClick={journey.resetJourney} className="text-xs underline">
            Reset
          </button>
        </div>
      </header>

      {state.screen === "contact" && (
        <main className="mx-auto max-w-xl px-6 py-16">
          <h2 className="font-serif text-2xl text-me-navy">
            Who&apos;s our Microsoft contact for this story?
          </h2>
          <input
            type="text"
            value={state.microsoftContact}
            onChange={(e) => journey.setMicrosoftContact(e.target.value)}
            placeholder="e.g. Jamie Smith, Partner Marketing"
            className="mt-4 w-full rounded-lg border border-me-line px-3 py-2 text-sm"
            data-testid="v3-ms-contact"
          />
          <button
            type="button"
            disabled={!state.microsoftContact.trim()}
            onClick={journey.continueFromContact}
            className="mt-4 rounded-lg bg-me-navy px-4 py-2 text-sm text-white disabled:opacity-50"
            data-testid="v3-contact-continue"
          >
            Continue
          </button>
        </main>
      )}

      {state.screen === "interview" && step && (
        <main className="mx-auto max-w-3xl px-6 py-8">
          <div className="mb-4 rounded-lg border border-me-amber/30 bg-me-amber/10 px-3 py-2 text-xs text-me-amber">
            Voice-first demo — speech-to-text may be simulated; type and upload are fully functional.
          </div>
          <div className="flex flex-wrap gap-2">
            {steps.map((s, i) => (
              <span
                key={s.id}
                className={`rounded-full px-2 py-0.5 text-xs ${
                  i === state.interviewStep
                    ? "bg-me-navy text-white"
                    : i < state.interviewStep
                      ? "bg-me-green/15 text-me-green"
                      : "bg-white text-me-slate"
                }`}
              >
                {s.label}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-me-slate">Progress {progress}%</p>

          <div className="mt-6 rounded-lg bg-me-navy px-4 py-3 text-sm text-white">
            <div className="flex items-start gap-2">
              <Volume2 className="mt-0.5 h-4 w-4" />
              <p>{step.prompt}</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-me-ice px-4 py-3">
            <VoiceFirstInput
              value={answer}
              inputMode={state.inputMode}
              showUpload={state.showUpload}
              onChange={setAnswer}
              onInputModeChange={journey.setInputMode}
              onShowUploadChange={journey.setShowUpload}
              onFiles={(files) =>
                journey.setResponse(step.id, {
                  value: answer,
                  files,
                })
              }
            />
          </div>

          <button
            type="button"
            disabled={!answer.trim()}
            onClick={() => {
              journey.setResponse(step.id, {
                value: answer,
                files: state.responses[step.id]?.files,
              });
              journey.advanceInterview();
              setAnswer("");
            }}
            className="mt-4 rounded-lg bg-me-navy px-4 py-2 text-sm text-white disabled:opacity-50"
            data-testid="v3-interview-continue"
          >
            Continue
          </button>
        </main>
      )}

      {state.screen === "wrap-up" && (
        <main className="mx-auto max-w-xl px-6 py-16 text-center">
          <h2 className="font-serif text-2xl text-me-navy">Wrap-up</h2>
          <p className="mt-4 text-me-slate">{journey.getWrapUpSummary()}</p>
          <button
            type="button"
            onClick={() => {
              journey.confirmWrapUp();
              navigate(submissionsPath);
            }}
            className="mt-8 rounded-lg bg-me-green px-6 py-2 text-sm font-medium text-white"
            data-testid="v3-confirm"
          >
            Confirm
          </button>
        </main>
      )}

      {(state.screen === "interview" || state.screen === "wrap-up") && (
        <>
          <OptionPreviewDrawer />
          <AddonPreviewDrawer />
        </>
      )}
    </div>
  );
}
