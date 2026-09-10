import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import type { V2Action } from "@/v2/data/journeyStagesV2";
import {
  adaptivePromptOverrides,
  manualEntryQuestions,
} from "@/v2/data/journeyStagesV2";
import { buildDraftAssist } from "@/v2/data/draftAssist";
import { customerApprovalStates } from "@/data/mockPartnerData";
import { InputRow } from "@/components/capture/InputRow";
import { SimulatedBadge } from "@/components/simulate/SimulatedBadge";
import { useJourneyV2 } from "@/v2/hooks/useJourneyV2";
import { useSpeech } from "@/hooks/useSpeech";

interface Props {
  action: V2Action;
}

export function V2ActionInput({ action }: Props) {
  const journey = useJourneyV2();
  const { speak } = useSpeech();
  const { state } = journey;
  const [text, setText] = useState(journey.state.responses[action.id]?.value ?? "");
  const [manualInput, setManualInput] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  useEffect(() => {
    const v = journey.state.responses[action.id]?.value;
    if (v) setText(v);
  }, [action.id, journey.state.responses[action.id]?.value]);

  const promptFor = (id: string, defaultPrompt: string) => {
    if (state.addons.adaptiveQuestions && adaptivePromptOverrides[id]) {
      return adaptivePromptOverrides[id];
    }
    return defaultPrompt;
  };

  const handleComplete = (files?: string[], videoUrl?: string) => {
    const response = {
      value: text || (videoUrl ? "Video response recorded." : ""),
      files,
      videoUrl,
    };
    journey.setResponse(action.id, response);
    journey.completeAction(action.id, response);
  };

  switch (action.inputType) {
    case "manual-entry": {
      const q = manualEntryQuestions[state.manualEntryStep];
      if (state.addons.loginAutoPull && !state.signedIn) {
        return (
          <div className="mt-3 space-y-3">
            <SimulatedBadge />
            <button
              type="button"
              onClick={journey.signInMock}
              className="rounded-lg bg-me-navy px-4 py-2 text-sm text-white"
              data-testid="v2-mock-sign-in"
            >
              Sign in with Microsoft
            </button>
            <p className="text-xs text-me-slate">Simulated for demo — add-on preview only.</p>
          </div>
        );
      }
      if (!q || state.manualEntryStep >= manualEntryQuestions.length) {
        return (
          <div className="mt-3 rounded-lg border border-me-line bg-white p-4 text-sm">
            <p className="font-medium text-me-navy">Thanks — we have your details.</p>
            <ul className="mt-2 space-y-1 text-me-slate">
              {manualEntryQuestions.map((item) => (
                <li key={item.id}>
                  <strong>{item.label}:</strong> {state.manualEntry[item.id]}
                </li>
              ))}
            </ul>
            {!journey.isActionComplete(action.id) && (
              <button
                type="button"
                onClick={() => journey.completeAction(action.id)}
                className="mt-3 rounded-lg bg-me-navy px-4 py-2 text-sm text-white"
                data-testid="v2-manual-continue"
              >
                Continue
              </button>
            )}
          </div>
        );
      }
      return (
        <div className="mt-3 space-y-3">
          <div className="rounded-lg bg-me-navy px-4 py-3 text-sm text-white">
            <div className="flex items-start gap-2">
              <Volume2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{q.prompt}</p>
            </div>
            <button
              type="button"
              onClick={() => speak(q.prompt)}
              className="mt-2 text-xs text-me-ice underline"
            >
              Read aloud
            </button>
          </div>
          <div className="rounded-lg bg-me-ice px-4 py-3">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder={`Type your ${q.label}...`}
              className="w-full rounded border border-me-line bg-white px-3 py-2 text-sm"
              data-testid={`v2-manual-${q.id}`}
            />
            <button
              type="button"
              disabled={!manualInput.trim()}
              onClick={() => {
                journey.setManualEntryField(q.id, manualInput.trim());
                setManualInput("");
                journey.advanceManualEntry();
              }}
              className="mt-2 rounded-lg bg-me-navy px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      );
    }

    case "consent":
      return (
        <div className="mt-3 space-y-3">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={state.affidavitAccepted}
              onChange={(e) => journey.setAffidavitAccepted(e.target.checked)}
              data-testid="v2-affidavit"
            />
            <span>
              I accept the affidavit and document-sharing agreement for this submission.
            </span>
          </label>
          <p className="text-sm font-medium text-me-navy">Customer permission to share</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {customerApprovalStates.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => journey.setCustomerApproval(s)}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  state.customerApproval === s
                    ? "border-me-navy bg-me-ice"
                    : "border-me-line bg-white"
                }`}
                data-testid={`v2-approval-${s}`}
              >
                {s}
              </button>
            ))}
          </div>
          {!journey.isActionComplete(action.id) && (
            <button
              type="button"
              disabled={!state.affidavitAccepted}
              onClick={() => journey.completeAction(action.id)}
              className="rounded-lg bg-me-navy px-4 py-2 text-sm text-white disabled:opacity-50"
              data-testid="v2-accept-consent"
            >
              Continue
            </button>
          )}
        </div>
      );

    case "text":
    case "upload": {
      const prompt = promptFor(action.id, action.prompt ?? "");
      return (
        <div className="mt-3 space-y-3">
          <div className="rounded-lg bg-me-navy px-4 py-3 text-sm text-white">
            <div className="flex items-start gap-2">
              <Volume2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{prompt}</p>
            </div>
            <button
              type="button"
              onClick={() => speak(prompt)}
              className="mt-2 text-xs text-me-ice underline"
            >
              Read aloud
            </button>
            {state.addons.adaptiveQuestions && adaptivePromptOverrides[action.id] && (
              <p className="mt-2 text-xs text-me-amber">Adaptive add-on question active</p>
            )}
          </div>
          <InputRow
            value={text}
            onChange={setText}
            showVideo={action.inputType === "text"}
            onVideoRecorded={(url) => {
              journey.setResponse(action.id, {
                value: text || "Video response recorded.",
                videoUrl: url,
              });
            }}
            onFiles={(files) => {
              journey.setResponse(action.id, { value: text, files });
            }}
          />
          {journey.state.responses[action.id]?.videoUrl && (
            <p className="text-xs text-me-green" data-testid="v2-video-attached">
              Video response attached — preview below the record button.
            </p>
          )}
          {!journey.isActionComplete(action.id) && (
            <button
              type="button"
              disabled={
                action.inputType === "text"
                  ? !text.trim() && !journey.state.responses[action.id]?.videoUrl
                  : !text.trim() && !journey.state.responses[action.id]?.files?.length
              }
              onClick={() =>
                handleComplete(
                  journey.state.responses[action.id]?.files,
                  journey.state.responses[action.id]?.videoUrl
                )
              }
              className="rounded-lg bg-me-navy px-4 py-2 text-sm text-white disabled:opacity-50"
              data-testid={`v2-complete-${action.id}`}
            >
              Continue
            </button>
          )}
        </div>
      );
    }

    case "draft-assist": {
      const result = buildDraftAssist(state.manualEntry, state.responses);
      if (!state.draftRevealed) {
        return (
          <div className="mt-3 text-center">
            {draftLoading ? (
              <p className="animate-pulse text-me-slate">Reading your submission...</p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDraftLoading(true);
                  setTimeout(() => {
                    journey.revealDraft();
                    setDraftLoading(false);
                  }, 1800);
                }}
                className="rounded-lg bg-me-navy px-6 py-3 text-white"
                data-testid="v2-generate-draft"
              >
                Generate starting draft
              </button>
            )}
          </div>
        );
      }
      return (
        <div className="mt-3 space-y-4">
          <SimulatedBadge />
          <div className="rounded-lg border border-me-line bg-white p-4 shadow-sm">
            <h4 className="font-serif text-lg text-me-navy">Starting draft</h4>
            <p className="mt-2 whitespace-pre-wrap text-sm text-me-slate">{result.draft}</p>
          </div>
          <div className="rounded-lg border border-me-amber/40 bg-me-amber/5 p-4">
            <h4 className="font-medium text-me-amber">Gaps flagged</h4>
            <ul className="mt-2 list-disc pl-5 text-sm text-me-slate">
              {result.gaps.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-me-line bg-me-card p-4">
            <h4 className="font-medium text-me-navy">Follow-up questions</h4>
            <ul className="mt-2 list-decimal pl-5 text-sm text-me-slate">
              {result.followUps.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
          {state.addons.ratingRubric && (
            <div className="rounded-lg border-2 border-me-amber bg-white p-4">
              <SimulatedBadge />
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-me-slate">Value Score</p>
                  <p className="text-2xl font-serif text-me-navy">0.78</p>
                </div>
                <div>
                  <p className="text-me-slate">Sentiment</p>
                  <p className="text-2xl font-serif text-me-navy">4.2 / 5</p>
                </div>
              </div>
            </div>
          )}
          {!journey.isActionComplete(action.id) && (
            <button
              type="button"
              onClick={() => journey.completeAction(action.id)}
              className="rounded-lg bg-me-navy px-4 py-2 text-sm text-white"
              data-testid="v2-draft-continue"
            >
              Continue to review
            </button>
          )}
        </div>
      );
    }

    case "review":
      return (
        <div className="mt-3 space-y-2">
          {journey.stages
            .flatMap((s) => s.actions)
            .filter((a) => a.inputType === "text" || a.inputType === "upload")
            .map((a) => (
              <details
                key={a.id}
                className="rounded-lg border border-me-line bg-white px-4 py-2 text-sm"
              >
                <summary className="cursor-pointer font-medium text-me-navy">
                  {a.title}
                </summary>
                <p className="mt-2 text-me-slate">
                  {state.responses[a.id]?.value || "—"}
                </p>
              </details>
            ))}
          {!journey.isActionComplete(action.id) && (
            <button
              type="button"
              onClick={() => journey.completeAction(action.id)}
              className="mt-2 rounded-lg bg-me-navy px-4 py-2 text-sm text-white"
              data-testid="v2-recap-continue"
            >
              Continue
            </button>
          )}
        </div>
      );

    case "attest":
      return (
        <div className="mt-3 space-y-3">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={state.attested}
              onChange={(e) => journey.setAttested(e.target.checked)}
              data-testid="v2-attest"
            />
            <span>I attest this information is accurate.</span>
          </label>
          <input
            type="text"
            value={state.signatureName}
            onChange={(e) => journey.setSignatureName(e.target.value)}
            placeholder="Type your full name"
            className="w-full rounded border border-me-line px-3 py-2 text-sm"
            data-testid="v2-typed-name"
          />
          {state.addons.customerCapture && (
            <div className="rounded-lg border-2 border-me-amber bg-me-amber/5 p-4">
              <SimulatedBadge />
              <button
                type="button"
                onClick={() => {
                  journey.sendCustomerLink();
                  setShowCustomerModal(true);
                }}
                className="mt-2 rounded-lg border border-me-amber px-4 py-2 text-sm text-me-navy"
                data-testid="v2-customer-link"
              >
                Send a recording link to my customer
              </button>
            </div>
          )}
          {showCustomerModal && (
            <div className="rounded-lg border border-me-line bg-white p-4 text-sm">
              <p className="font-medium text-me-navy">Shareable link (simulated)</p>
              <code className="mt-2 block break-all text-xs text-me-slate">
                https://partner-story-bot.example/consent/demo-token-v2
              </code>
              <p className="mt-2">
                Status:{" "}
                <span
                  className={
                    state.customerLinkReceived ? "text-me-green" : "text-me-amber"
                  }
                >
                  {state.customerLinkReceived ? "Received" : state.customerLinkSent ? "Sent" : "Pending"}
                </span>
              </p>
              {!state.customerLinkReceived && (
                <button
                  type="button"
                  onClick={journey.simulateCustomerResponse}
                  className="mt-2 text-xs text-me-navy underline"
                >
                  Simulate response
                </button>
              )}
            </div>
          )}
          {!state.submitted && (
            <button
              type="button"
              disabled={!state.attested || !state.signatureName.trim()}
              onClick={() => {
                journey.submit();
                journey.completeAction(action.id);
              }}
              className="rounded-lg bg-me-green px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
              data-testid="v2-submit"
            >
              Submit story
            </button>
          )}
          {state.submitted && (
            <p className="text-sm font-medium text-me-green">
              Submitted — thank you. Your draft is saved locally in this demo.
            </p>
          )}
        </div>
      );

    default:
      return null;
  }
}
