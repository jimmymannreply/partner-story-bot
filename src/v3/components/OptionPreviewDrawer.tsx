import { X } from "lucide-react";
import { useState } from "react";
import { SimulatedBadge } from "@/components/simulate/SimulatedBadge";
import { useJourneyV3 } from "@/v3/hooks/useJourneyV3";

export function OptionPreviewDrawer() {
  const { state, setOption } = useJourneyV3();
  const [open, setOpen] = useState(false);
  const draft =
    state.responses.solution?.value ||
    state.responses["about-you"]?.value ||
    "your partner solution";
  const customer =
    state.responses.customer?.value?.split(/[,.]/)[0] || "the customer";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-40 rounded-full border-2 border-me-amber bg-white px-4 py-2 text-sm font-medium text-me-navy shadow-lg"
        data-testid="v3-options-drawer-open"
      >
        Preview Options
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="h-full w-full max-w-md bg-me-card p-5" data-testid="v3-options-drawer">
            <div className="flex items-center justify-between">
              <p className="font-serif text-lg text-me-navy">Option previews</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X />
              </button>
            </div>
            <label className="mt-4 flex gap-3 rounded-lg border border-me-line bg-white p-4">
              <input
                type="checkbox"
                checked={state.options.draftAssist}
                onChange={(e) => setOption("draftAssist", e.target.checked)}
                data-testid="v3-option-draft"
              />
              <span className="text-sm">Draft Assist (Option A)</span>
            </label>
            {state.options.draftAssist && (
              <div className="mt-2 rounded-lg border-2 border-me-amber bg-white p-3 text-sm">
                <SimulatedBadge />
                <p className="mt-2 text-me-slate">
                  {customer} partnered with your team to deliver {draft}. Early outcomes
                  suggest faster time-to-value and stronger executive sponsorship. This
                  ~150-word starting draft would be generated from the live transcript in
                  the add-on build.
                </p>
              </div>
            )}
            <label className="mt-4 flex gap-3 rounded-lg border border-me-line bg-white p-4">
              <input
                type="checkbox"
                checked={state.options.rubricGrading}
                onChange={(e) => setOption("rubricGrading", e.target.checked)}
                data-testid="v3-option-rubric"
              />
              <span className="text-sm">Rubric Grading (Option B)</span>
            </label>
            {state.options.rubricGrading && (
              <div className="mt-2 rounded-lg border-2 border-me-amber bg-white p-3 text-sm">
                <SimulatedBadge />
                <p className="font-serif text-2xl text-me-navy">Priority 4 / 5</p>
                <p className="text-me-slate">
                  Strong customer voice and Microsoft fit; add a hard metric to reach publish-ready.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
