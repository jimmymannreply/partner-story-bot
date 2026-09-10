import { Settings2, X } from "lucide-react";
import { useState } from "react";
import { useJourneyV2 } from "@/v2/hooks/useJourneyV2";
import type { V2Addons } from "@/v2/hooks/useJourneyV2";

const addonDefs: { key: keyof V2Addons; label: string; description: string }[] = [
  {
    key: "loginAutoPull",
    label: "Login + Auto-Pull",
    description: "Mock Partner Center sign-in and pre-filled profile on Manual Entry.",
  },
  {
    key: "adaptiveQuestions",
    label: "Adaptive Questions",
    description: "Swap interview questions 6 and 9 for story-type variants.",
  },
  {
    key: "ratingRubric",
    label: "Rating / Rubric",
    description: "Show simulated Value and Sentiment scores on Draft Assist.",
  },
  {
    key: "customerCapture",
    label: "Customer Capture",
    description: "Send a recording link to your customer on Review.",
  },
];

export function AddonDrawer() {
  const { state, setAddon } = useJourneyV2();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border-2 border-me-amber bg-white px-4 py-2 text-sm font-medium text-me-navy shadow-lg"
        data-testid="addon-drawer-open"
      >
        <Settings2 className="h-4 w-4 text-me-amber" />
        Preview Add-Ons
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div
            className="h-full w-full max-w-md bg-me-card shadow-xl"
            data-testid="addon-drawer"
          >
            <div className="flex items-center justify-between border-b border-me-line bg-me-navy px-5 py-4 text-white">
              <div>
                <p className="font-serif text-lg">Preview Add-Ons</p>
                <p className="text-xs text-me-ice/80">Off by default — for presenter demos only</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              {addonDefs.map((addon) => (
                <label
                  key={addon.key}
                  className="flex cursor-pointer gap-3 rounded-lg border border-me-line bg-white p-4"
                >
                  <input
                    type="checkbox"
                    checked={state.addons[addon.key]}
                    onChange={(e) => setAddon(addon.key, e.target.checked)}
                    className="mt-1 accent-me-amber"
                    data-testid={`addon-${addon.key}`}
                  />
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-me-navy">
                      {addon.label}
                      <span className="rounded bg-me-amber/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-me-amber">
                        Add-on
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-me-slate">{addon.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
