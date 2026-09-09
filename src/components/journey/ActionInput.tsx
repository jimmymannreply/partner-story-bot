import { useEffect, useState } from "react";
import type { JourneyAction } from "@/data/journeyStages";
import { customerApprovalStates } from "@/data/mockPartnerData";
import { useJourney } from "@/hooks/useJourneyState";
import { InputRow } from "@/components/capture/InputRow";
import { SignaturePad } from "@/components/capture/SignaturePad";
import { VideoRecorder } from "@/components/capture/VideoRecorder";
import { SimulatedBadge } from "@/components/simulate/SimulatedBadge";
import { EvidenceEngine } from "@/components/simulate/EvidenceEngine";
import { buildConsentMailto } from "@/lib/consentEmail";

interface ActionInputProps {
  action: JourneyAction;
}

export function ActionInput({ action }: ActionInputProps) {
  const journey = useJourney();
  const { state } = journey;
  const [text, setText] = useState(
    journey.state.responses[action.id]?.value ?? ""
  );
  const [emailInput, setEmailInput] = useState("");
  const [engagementTab, setEngagementTab] = useState<
    "engagements" | "sales" | "mci"
  >("engagements");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const v = journey.state.responses[action.id]?.value;
    if (v) setText(v);
  }, [action.id, journey.state.responses[action.id]?.value]);

  const isPrefilled = state.prefilledActions.has(action.id);

  const handleComplete = (files?: string[], videoUrl?: string) => {
    journey.setResponse(action.id, { value: text, files, videoUrl });
    journey.completeAction(action.id, { value: text, files, videoUrl });
  };

  switch (action.inputType) {
    case "oauth":
      return (
        <div className="mt-3 space-y-3">
          <SimulatedBadge />
          {!state.signedIn && !state.guestMode ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setSigningIn(true);
                  setTimeout(() => journey.signIn(), 1200);
                }}
                disabled={signingIn}
                className="rounded-dl bg-dl-brand px-4 py-2 text-sm font-medium text-white hover:bg-dl-brand-hover disabled:opacity-60"
                data-testid="sign-in-button"
              >
                {signingIn ? "Signing in..." : "Sign in with Partner Center"}
              </button>
              <button
                type="button"
                onClick={journey.continueAsGuest}
                className="block text-sm text-dl-brand hover:underline"
                data-testid="continue-as-guest"
              >
                Continue without signing in
              </button>
              <p className="text-xs text-dl-text-secondary">
                Guest mode: fill the form manually and submit at attest and sign.
                Your progress is saved automatically.
              </p>
            </>
          ) : state.guestMode ? (
            <p className="text-sm text-dl-text-secondary">
              Continuing as guest. Select your win below, then capture your story.
            </p>
          ) : (
            <p className="text-sm text-dl-success">Signed in successfully.</p>
          )}
        </div>
      );

    case "confirm":
      if (state.guestMode) return null;
      return (
        <div className="mt-3 space-y-3">
          <SimulatedBadge />
          <div className="rounded-dl border border-dl-border bg-dl-page p-4 text-sm">
            <p><strong>Company:</strong> {journey.profile.companyName}</p>
            <p><strong>HQ:</strong> {journey.profile.headquarters}</p>
            <p><strong>Size:</strong> {journey.profile.companySize}</p>
            <p><strong>Website:</strong> {journey.profile.website}</p>
          </div>
          {!state.profileConfirmed && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={journey.confirmProfile}
                className="rounded-dl bg-dl-brand px-4 py-2 text-sm text-white"
                data-testid="confirm-profile"
              >
                Looks right, continue
              </button>
            </div>
          )}
        </div>
      );

    case "designations":
      if (state.guestMode) return null;
      return (
        <div className="mt-3 space-y-3">
          <SimulatedBadge />
          <ul className="space-y-1 text-sm">
            {state.designations.map((d) => (
              <li key={d.id} className="flex items-center gap-2">
                <span className="text-dl-success">✓</span> {d.name}
              </li>
            ))}
          </ul>
          {!journey.isActionComplete(action.id) && (
            <button
              type="button"
              onClick={() => journey.completeAction(action.id)}
              className="rounded-dl bg-dl-brand px-4 py-2 text-sm text-white"
              data-testid="confirm-designations"
            >
              Looks right, continue
            </button>
          )}
        </div>
      );

    case "engagement":
      return (
        <div className="mt-3 space-y-3">
          <SimulatedBadge />
          <div className="flex gap-2 border-b border-dl-border">
            {(
              [
                ["engagements", "Engagements"],
                ["sales", "Microsoft Sales"],
                ["mci", "MCI"],
              ] as const
            ).map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setEngagementTab(tab)}
                className={`px-3 py-2 text-sm font-medium ${
                  engagementTab === tab
                    ? "border-b-2 border-dl-brand text-dl-brand"
                    : "text-dl-text-secondary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid gap-2">
            {journey.engagements
              .filter((e) => {
                if (engagementTab === "engagements") return e.source === "engagement";
                if (engagementTab === "sales") return e.source === "sale";
                return e.source === "mci";
              })
              .map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => journey.selectEngagement(e)}
                  className={`rounded-dl border p-3 text-left text-sm ${
                    state.selectedEngagement?.id === e.id
                      ? "border-dl-brand bg-blue-50"
                      : "border-dl-border hover:border-dl-brand/40"
                  }`}
                  data-testid={`engagement-${e.id}`}
                >
                  <p className="font-medium">{e.name}</p>
                  <p className="text-xs text-dl-text-secondary">
                    {e.customer} · {e.date}
                  </p>
                </button>
              ))}
          </div>
          {state.selectedEngagement && (
            <p className="rounded-dl bg-dl-success-bg px-3 py-2 text-xs text-dl-success">
              Pre-filled interview sections from {state.selectedEngagement.source === "mci" ? "MCI" : state.selectedEngagement.source === "sale" ? "Microsoft Sales" : "engagement"} data.
            </p>
          )}
          <input
            type="text"
            value={state.customEngagement}
            onChange={(e) => journey.setCustomEngagement(e.target.value)}
            placeholder="Or add your own engagement..."
            className="w-full rounded-dl border border-dl-border px-3 py-2 text-sm"
          />
          {!journey.isActionComplete(action.id) && (
            <button
              type="button"
              onClick={() => journey.completeAction(action.id)}
              disabled={!state.selectedEngagement && !state.customEngagement}
              className="rounded-dl bg-dl-brand px-4 py-2 text-sm text-white disabled:opacity-50"
              data-testid="select-engagement"
            >
              Continue with selection
            </button>
          )}
        </div>
      );

    case "consent":
      return (
        <div className="mt-3 space-y-3 text-sm">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={state.affidavitAccepted}
              onChange={(e) => journey.setAffidavitAccepted(e.target.checked)}
              data-testid="affidavit-checkbox"
            />
            I accept the affidavit and document-sharing terms.
          </label>
          <div>
            <p className="mb-2 font-medium">Customer approval status:</p>
            <div className="flex flex-wrap gap-2">
              {customerApprovalStates.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => journey.setCustomerApproval(s)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    state.customerApproval === s
                      ? "bg-dl-brand text-white"
                      : "border border-dl-border"
                  }`}
                  data-testid={`approval-${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {!journey.isActionComplete(action.id) && (
            <button
              type="button"
              onClick={() => journey.completeAction(action.id)}
              disabled={!state.affidavitAccepted}
              className="rounded-dl bg-dl-brand px-4 py-2 text-sm text-white disabled:opacity-50"
              data-testid="accept-consent"
            >
              Accept and continue
            </button>
          )}
        </div>
      );

    case "customer-invite": {
      const engagementName =
        state.selectedEngagement?.name || state.customEngagement || "your engagement";
      const partnerName = state.guestMode
        ? "Partner"
        : journey.profile.companyName;

      return (
        <div className="mt-3 space-y-3">
          <SimulatedBadge />
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="customer@example.com"
            className="w-full rounded-dl border border-dl-border px-3 py-2 text-sm"
            data-testid="customer-email-input"
          />
          <button
            type="button"
            onClick={() => {
              if (!emailInput.includes("@")) return;
              journey.setCustomerEmails([...state.customerEmails, emailInput]);
              setEmailInput("");
            }}
            className="rounded-dl border border-dl-border px-4 py-2 text-sm"
          >
            Add email
          </button>
          {state.customerEmails.length > 0 && (
            <div className="rounded-dl border border-dl-border bg-dl-page p-3 text-sm">
              <p className="font-medium">Consent email preview:</p>
              <ul className="mt-1 text-dl-text-secondary">
                {state.customerEmails.map((e) => (
                  <li key={e}>
                    {e}
                    {state.consentEmailsSent.includes(e) && (
                      <span className="ml-2 text-dl-success">(sent)</span>
                    )}
                  </li>
                ))}
              </ul>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-dl-brand">
                  Preview message
                </summary>
                <pre className="mt-1 whitespace-pre-wrap text-xs text-dl-text-secondary">
                  {decodeURIComponent(
                    buildConsentMailto(
                      state.customerEmails[0],
                      partnerName,
                      engagementName
                    ).split("body=")[1] ?? ""
                  )}
                </pre>
              </details>
            </div>
          )}
          {!journey.isActionComplete(action.id) && state.customerEmails.length > 0 && (
            <button
              type="button"
              onClick={journey.sendConsentEmails}
              className="rounded-dl bg-dl-brand px-4 py-2 text-sm text-white"
              data-testid="send-consent"
            >
              Open email to send consent links
            </button>
          )}
        </div>
      );
    }

    case "review":
      return (
        <div className="mt-3 space-y-2">
          {journey.stages.flatMap((s) =>
            s.actions
              .filter((a) => journey.state.responses[a.id])
              .map((a) => (
                <details
                  key={a.id}
                  className="rounded-dl border border-dl-border p-3 text-sm"
                >
                  <summary className="cursor-pointer font-medium">
                    {a.title}
                    {state.prefilledActions.has(a.id) && (
                      <span className="ml-2 text-xs text-dl-brand">(pre-filled)</span>
                    )}
                  </summary>
                  <p className="mt-2 text-dl-text-secondary">
                    {journey.state.responses[a.id]?.value || "—"}
                  </p>
                </details>
              ))
          )}
          {!journey.isActionComplete(action.id) && (
            <button
              type="button"
              onClick={() => journey.completeAction(action.id)}
              className="rounded-dl bg-dl-brand px-4 py-2 text-sm text-white"
              data-testid="complete-review"
            >
              Review complete
            </button>
          )}
        </div>
      );

    case "attest":
      return (
        <div className="mt-3 space-y-3">
          {state.guestMode && (
            <p className="rounded-dl bg-dl-page px-3 py-2 text-sm text-dl-text-secondary">
              Guest submission: provide your name and signature below to submit.
            </p>
          )}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={state.attested}
              onChange={(e) => journey.setAttested(e.target.checked)}
              data-testid="attest-checkbox"
            />
            I attest that the information provided is accurate to the best of my
            knowledge.
          </label>
          <input
            type="text"
            value={state.signatureName}
            onChange={(e) => journey.setSignatureName(e.target.value)}
            placeholder="Type your full name"
            className="w-full rounded-dl border border-dl-border px-3 py-2 text-sm"
            data-testid="signature-name"
          />
          <SignaturePad onSign={journey.setSignatureDataUrl} />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={journey.saveDraft}
              className="rounded-dl border border-dl-border px-4 py-2 text-sm"
              data-testid="save-draft"
            >
              Save draft
            </button>
            {!journey.isActionComplete(action.id) && (
              <button
                type="button"
                onClick={journey.submit}
                disabled={
                  !state.attested || !state.signatureName || !state.signatureDataUrl
                }
                className="rounded-dl bg-dl-brand px-4 py-2 text-sm text-white disabled:opacity-50"
                data-testid="submit-attestation"
              >
                Submit
              </button>
            )}
          </div>
          {state.draftSavedAt && (
            <p className="text-xs text-dl-text-secondary">
              Draft saved {new Date(state.draftSavedAt).toLocaleString()}
            </p>
          )}
        </div>
      );

    case "engine":
      return <EvidenceEngine />;

    default:
      return (
        <div className="mt-3">
          {isPrefilled && (
            <p className="mb-2 rounded-dl bg-blue-50 px-3 py-2 text-xs text-dl-brand">
              Pre-filled from partner data — review and edit as needed.
            </p>
          )}
          {state.skipAheadCount > 0 && action.id === "about-you" && (
            <div className="mb-3 rounded-dl bg-dl-success-bg px-3 py-2 text-sm text-dl-success">
              Found answers to {state.skipAheadCount} of 11 questions from your
              uploaded case study.
            </div>
          )}
          {action.id === "customer-record" ? (
            <VideoRecorder
              onRecordingComplete={(_blob, url) => {
                setText("Customer video recording attached.");
                journey.setResponse(action.id, {
                  value: "Customer video recording attached.",
                  videoUrl: url,
                });
              }}
            />
          ) : (
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
                if (action.inputType === "upload" && files.length > 0) {
                  handleComplete(files);
                }
              }}
            />
          )}
          {!journey.isActionComplete(action.id) && (
            <button
              type="button"
              onClick={() =>
                handleComplete(
                  journey.state.responses[action.id]?.files,
                  journey.state.responses[action.id]?.videoUrl
                )
              }
              disabled={
                !text &&
                action.inputType !== "upload" &&
                !journey.state.responses[action.id]?.videoUrl
              }
              className="mt-3 rounded-dl bg-dl-brand px-4 py-2 text-sm text-white disabled:opacity-50"
              data-testid={`complete-${action.id}`}
            >
              Save and continue
            </button>
          )}
          {action.id === "customer-record" &&
            journey.state.responses[action.id]?.videoUrl &&
            !state.customerVideoReceived && (
              <button
                type="button"
                onClick={journey.markCustomerVideoReceived}
                className="mt-2 rounded-dl bg-dl-brand px-4 py-2 text-sm text-white"
                data-testid="confirm-customer-video"
              >
                Confirm video saved
              </button>
            )}
          {action.id === "customer-received" && state.customerVideoReceived && (
            <span className="mt-2 inline-flex rounded-full bg-dl-success-bg px-3 py-1 text-xs text-dl-success">
              Video received
            </span>
          )}
        </div>
      );
  }
}
