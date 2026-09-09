import { useEffect } from "react";
import { useJourney } from "@/hooks/useJourneyState";
import { SimulatedBadge } from "./SimulatedBadge";

const STEPS = ["Collect", "Validate", "Rate", "Publish"];

const FIT_CHECKS = [
  { label: "Recent (within 2 years)", pass: true },
  { label: "Microsoft technology fit", pass: true },
  { label: "Realistic approval path", pass: false },
];

export function EvidenceEngine() {
  const { state, advanceEngine } = useJourney();

  useEffect(() => {
    if (state.submitted && state.engineStep > 0 && state.engineStep < 4) {
      const timer = setTimeout(() => advanceEngine(), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.submitted, state.engineStep, advanceEngine]);

  if (!state.submitted) {
    return (
      <p className="mt-3 text-sm text-dl-text-secondary">
        Complete attestation above to see the Evidence Engine.
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-4" data-testid="evidence-engine">
      <SimulatedBadge />

      <div className="flex items-center gap-2">
        {STEPS.map((step, i) => {
          const stepNum = i + 1;
          const active = state.engineStep >= stepNum;
          const current = state.engineStep === stepNum;
          return (
            <div key={step} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  active
                    ? "bg-dl-brand text-white"
                    : "border border-dl-border text-dl-text-secondary"
                } ${current ? "ring-2 ring-dl-brand/30" : ""}`}
              >
                {stepNum}
              </div>
              <span
                className={`text-sm ${
                  active ? "font-medium text-dl-text" : "text-dl-text-secondary"
                }`}
              >
                {step}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    state.engineStep > stepNum ? "bg-dl-brand" : "bg-dl-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {state.engineStep >= 3 && (
        <div className="rounded-dl border border-dl-border p-4">
          <h4 className="text-sm font-semibold">Nomination Fit Screen</h4>
          <ul className="mt-2 space-y-1 text-sm">
            {FIT_CHECKS.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <span className={c.pass ? "text-dl-success" : "text-dl-warning"}>
                  {c.pass ? "✓" : "⚠"}
                </span>
                {c.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.engineStep >= 3 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-dl border border-dl-border p-3">
            <p className="text-xs text-dl-text-secondary">Value Score</p>
            <p className="text-2xl font-semibold text-dl-brand">0.78</p>
            <p className="text-xs text-dl-text-secondary">Threshold: 0.70</p>
          </div>
          <div className="rounded-dl border border-dl-border p-3">
            <p className="text-xs text-dl-text-secondary">Sentiment Score</p>
            <p className="text-2xl font-semibold text-dl-brand">4.2</p>
            <p className="text-xs text-dl-text-secondary">Threshold: 4.0</p>
          </div>
        </div>
      )}

      {state.engineStep >= 4 && (
        <div className="rounded-dl bg-dl-success-bg p-4 text-sm text-dl-success">
          Publishes to Explore Microsoft Partner Success Stories
        </div>
      )}

      {state.engineStep < 4 && (
        <button
          type="button"
          onClick={advanceEngine}
          className="rounded-dl bg-dl-brand px-4 py-2 text-sm text-white"
          data-testid="advance-engine"
        >
          Show me what happens next
        </button>
      )}

      {state.engineStep >= 4 && (
        <div className="rounded-dl border border-dl-border bg-dl-page p-4 text-sm">
          <p className="font-medium">Email summary (simulated)</p>
          <p className="mt-1 text-dl-text-secondary">
            Your partner evidence story for{" "}
            {state.selectedEngagement?.customer ?? "your customer"} has been
            submitted. Value: 0.78 · Sentiment: 4.2 · Routed to narrative
            compiler queue.
          </p>
        </div>
      )}
    </div>
  );
}
