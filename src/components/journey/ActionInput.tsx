import { useState } from "react";
import type { JourneyAction } from "@/data/journeyStages";
import { designationCatalog } from "@/data/mockPartnerData";
import { customerApprovalStates } from "@/data/mockPartnerData";
import { useJourney } from "@/hooks/useJourneyState";
import { InputRow } from "@/components/capture/InputRow";
import { SignaturePad } from "@/components/capture/SignaturePad";
import { SimulatedBadge } from "@/components/simulate/SimulatedBadge";
import { EvidenceEngine } from "@/components/simulate/EvidenceEngine";

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
  const [newDesignation, setNewDesignation] = useState("");
  const [engagementTab, setEngagementTab] = useState<"engagements" | "sales">(
    "engagements"
  );
  const [signingIn, setSigningIn] = useState(false);

  const handleComplete = (files?: string[]) => {
    journey.setResponse(action.id, { value: text, files });
    journey.completeAction(action.id, { value: text, files });
  };

  switch (action.inputType) {
    case "oauth":
      return (
        <div className="mt-3 space-y-3">
          <SimulatedBadge />
          {!state.signedIn ? (
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
          ) : (
            <p className="text-sm text-dl-success">Signed in successfully.</p>
          )}
        </div>
      );

    case "confirm":
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
              <button
                type="button"
                onClick={() => {
                  journey.resetJourney();
                }}
                className="rounded-dl border border-dl-border px-4 py-2 text-sm"
              >
                Sign in again
              </button>
            </div>
          )}
        </div>
      );

    case "designations":
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
          <div className="flex gap-2">
            <input
              type="text"
              value={newDesignation}
              onChange={(e) => setNewDesignation(e.target.value)}
              placeholder="Add a designation..."
              className="flex-1 rounded-dl border border-dl-border px-3 py-2 text-sm"
              list="designation-catalog"
            />
            <datalist id="designation-catalog">
              {designationCatalog.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
            <button
              type="button"
              onClick={() => {
                if (!newDesignation) return;
                const valid = designationCatalog.includes(newDesignation);
                journey.setDesignations([
                  ...state.designations,
                  {
                    id: `custom-${Date.now()}`,
                    name: newDesignation,
                    valid,
                  },
                ]);
                setNewDesignation("");
              }}
              className="rounded-dl border border-dl-border px-3 py-2 text-sm"
            >
              Add
            </button>
          </div>
          {!journey.isActionComplete(action.id) && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => journey.completeAction(action.id)}
                className="rounded-dl bg-dl-brand px-4 py-2 text-sm text-white"
                data-testid="confirm-designations"
              >
                Looks right, continue
              </button>
              <button
                type="button"
                className="rounded-dl border border-dl-border px-4 py-2 text-sm"
              >
                Skip
              </button>
            </div>
          )}
        </div>
      );

    case "engagement":
      return (
        <div className="mt-3 space-y-3">
          <SimulatedBadge />
          <div className="flex gap-2 border-b border-dl-border">
            {(["engagements", "sales"] as const).map((tab) => (
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
                {tab === "engagements" ? "Engagements" : "Microsoft Sales"}
              </button>
            ))}
          </div>
          <div className="grid gap-2">
            {journey.engagements
              .filter((e) =>
                engagementTab === "engagements"
                  ? e.type === "engagement"
                  : e.type === "sale"
              )
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

    case "customer-invite":
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
              if (!emailInput) return;
              journey.setCustomerEmails([...state.customerEmails, emailInput]);
              setEmailInput("");
            }}
            className="rounded-dl border border-dl-border px-4 py-2 text-sm"
          >
            Add email
          </button>
          {state.customerEmails.length > 0 && (
            <div className="rounded-dl border border-dl-border bg-dl-page p-3 text-sm">
              <p className="font-medium">Consent email preview (simulated):</p>
              <p className="mt-1 text-dl-text-secondary">
                To: {state.customerEmails.join(", ")}
              </p>
              <p className="text-dl-text-secondary">
                Subject: Share your experience — quick video or voice recording
              </p>
            </div>
          )}
          {!journey.isActionComplete(action.id) && state.customerEmails.length > 0 && (
            <button
              type="button"
              onClick={() => journey.completeAction(action.id)}
              className="rounded-dl bg-dl-brand px-4 py-2 text-sm text-white"
              data-testid="send-consent"
            >
              Send consent emails (simulated)
            </button>
          )}
        </div>
      );

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
      );

    case "engine":
      return <EvidenceEngine />;

    default:
      return (
        <div className="mt-3">
          {state.skipAheadCount > 0 && action.id === "about-you" && (
            <div className="mb-3 rounded-dl bg-dl-success-bg px-3 py-2 text-sm text-dl-success">
              Found answers to {state.skipAheadCount} of 11 questions from your
              uploaded case study.
            </div>
          )}
          <InputRow
            value={text}
            onChange={setText}
            onFiles={(files) => {
              journey.setResponse(action.id, { value: text, files });
              if (action.inputType === "upload" && files.length > 0) {
                handleComplete(files);
              }
            }}
          />
          {!journey.isActionComplete(action.id) && (
            <button
              type="button"
              onClick={() => handleComplete()}
              disabled={!text && action.inputType !== "upload"}
              className="mt-3 rounded-dl bg-dl-brand px-4 py-2 text-sm text-white disabled:opacity-50"
              data-testid={`complete-${action.id}`}
            >
              Save and continue
            </button>
          )}
          {action.id === "customer-record" && !state.customerVideoReceived && (
            <button
              type="button"
              onClick={journey.simulateCustomerVideo}
              className="mt-2 rounded-dl border border-dl-border px-4 py-2 text-sm"
              data-testid="simulate-video"
            >
              Simulate customer video received
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
