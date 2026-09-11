import { X } from "lucide-react";
import { useState } from "react";
import { SimulatedBadge } from "@/components/simulate/SimulatedBadge";
import { useJourneyV3, type V3Addons } from "@/v3/hooks/useJourneyV3";

const addonDefs: { key: keyof V3Addons; label: string; preview: string }[] = [
  { key: "piiRedaction", label: "PII Redaction", preview: "Would mask names and account IDs before storage." },
  { key: "activeReviewRouting", label: "Active Review Routing", preview: "Would route to the named Microsoft sponsor for approval." },
  { key: "customerApprovalForm", label: "Customer-Approval Form", preview: "Would send a lightweight customer sign-off form." },
  { key: "adaptiveQuestions", label: "Adaptive Questions", preview: "Would branch follow-ups based on story type." },
  { key: "loginAutoPull", label: "Login + Auto-Pull", preview: "Would pre-fill from Partner Center and sales data." },
  { key: "customerContentCapture", label: "Customer Content Capture", preview: "Would generate a recording link for the customer." },
];

export function AddonPreviewDrawer() {
  const { state, setAddon } = useJourneyV3();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full border-2 border-me-amber bg-white px-4 py-2 text-sm font-medium text-me-navy shadow-lg"
        data-testid="v3-addons-drawer-open"
      >
        Preview Add-Ons
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="h-full w-full max-w-md overflow-y-auto bg-me-card p-5" data-testid="v3-addons-drawer">
            <div className="flex items-center justify-between">
              <p className="font-serif text-lg text-me-navy">Add-on previews</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {addonDefs.map((addon) => (
                <div key={addon.key} className="rounded-lg border border-me-line bg-white p-4">
                  <label className="flex gap-3">
                    <input
                      type="checkbox"
                      checked={state.addons[addon.key]}
                      onChange={(e) => setAddon(addon.key, e.target.checked)}
                      data-testid={`v3-addon-${addon.key}`}
                    />
                    <span className="text-sm font-medium">{addon.label}</span>
                  </label>
                  {state.addons[addon.key] && (
                    <p className="mt-2 text-xs text-me-slate">
                      <SimulatedBadge className="inline" /> {addon.preview}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
