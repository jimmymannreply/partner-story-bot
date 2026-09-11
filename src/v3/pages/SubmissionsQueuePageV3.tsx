import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, FileText, Star } from "lucide-react";
import { SimulatedBadge } from "@/components/simulate/SimulatedBadge";
import { buildV3Queue } from "@/v3/data/mockSubmissionsQueueV3";
import { useJourneyV3 } from "@/v3/hooks/useJourneyV3";

const v3Standalone = import.meta.env.VITE_V3_STANDALONE === "true";
const journeyPath = v3Standalone ? "/journey" : "/v3/journey";
const homePath = v3Standalone ? "/" : "/v3";

function downloadDraft(filename: string, body: string) {
  const blob = new Blob([body], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function SubmissionsQueuePageV3() {
  const { state } = useJourneyV3();
  const rows = useMemo(
    () => buildV3Queue(state.microsoftContact, state.responses),
    [state.microsoftContact, state.responses]
  );
  const [selectedId, setSelectedId] = useState(
    rows.find((r) => r.isCurrent)?.id ?? rows[0]?.id
  );
  const selected = rows.find((r) => r.id === selectedId) ?? rows[0];

  return (
    <div className="min-h-screen bg-me-card">
      <header className="border-b border-me-line bg-me-navy-dark px-6 py-4 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="font-serif text-xl">Voice Intake Queue (V3)</p>
            <p className="text-sm text-me-ice/80">Mock reviewer console after wrap-up confirm</p>
          </div>
          <div className="flex gap-3 text-sm">
            <Link to={homePath} className="text-me-ice hover:underline">Home</Link>
            <Link to={journeyPath} className="text-me-ice hover:underline">New interview</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-4 flex items-center gap-3">
          <SimulatedBadge />
          <p className="text-sm text-me-slate">Simulated queue — voice-first submissions with Microsoft sponsor.</p>
        </div>

        {state.confirmed && (
          <div className="mb-6 rounded-lg border border-me-green/40 bg-me-green/10 px-4 py-3 text-sm text-me-green" data-testid="v3-submit-success">
            Interview confirmed. Microsoft contact: <strong>{state.microsoftContact}</strong>
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-me-line bg-white shadow-sm">
          <table className="w-full text-left text-sm" data-testid="v3-submissions-table">
            <thead className="bg-me-navy text-xs uppercase tracking-wide text-me-ice">
              <tr>
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">MS Contact</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Sentiment</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Files</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className={`cursor-pointer border-t border-me-line hover:bg-me-card ${
                    row.id === selectedId ? "bg-me-ice/40" : ""
                  } ${row.isCurrent ? "ring-2 ring-inset ring-me-green/50" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-me-navy">
                    {row.partner}
                    {row.isCurrent && (
                      <span className="ml-2 rounded bg-me-green/15 px-1.5 py-0.5 text-[10px] text-me-green">
                        Just submitted
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-me-slate">{row.customer}</td>
                  <td className="px-4 py-3 text-me-slate">{row.microsoftContact}</td>
                  <td className="px-4 py-3">{row.valueScore.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Star className="inline h-3.5 w-3.5 text-me-amber" /> {row.sentimentScore.toFixed(1)}
                  </td>
                  <td className="px-4 py-3">{row.priorityScore}/5</td>
                  <td className="px-4 py-3">{row.files.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <section className="mt-8 grid gap-6 lg:grid-cols-2" data-testid="v3-submission-detail">
            <div className="rounded-lg border border-me-line bg-white p-5">
              <h2 className="font-serif text-lg text-me-navy">Submitted files</h2>
              <ul className="mt-4 space-y-2">
                {selected.files.map((file) => (
                  <li key={file.name} className="flex items-center gap-2 rounded border border-me-line px-3 py-2 text-sm">
                    <FileText className="h-4 w-4" /> {file.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="font-serif text-lg text-me-navy">Word draft options</h2>
              {selected.drafts.map((draft) => (
                <article key={draft.id} className="rounded-lg border border-me-line bg-white p-5" data-testid={`v3-draft-${draft.id}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{draft.label}</p>
                      <p className="text-xs text-me-slate">{draft.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadDraft(draft.filename, draft.body)}
                      className="inline-flex items-center gap-1 rounded-lg bg-me-navy px-3 py-1.5 text-xs text-white"
                    >
                      <Download className="h-3.5 w-3.5" /> .docx
                    </button>
                  </div>
                  <pre className="mt-3 max-h-32 overflow-auto whitespace-pre-wrap rounded bg-me-card p-3 text-xs text-me-slate">
                    {draft.body}
                  </pre>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
