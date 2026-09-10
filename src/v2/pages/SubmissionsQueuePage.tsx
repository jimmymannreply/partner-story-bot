import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, FileText, Star } from "lucide-react";
import { SimulatedBadge } from "@/components/simulate/SimulatedBadge";
import type { QueueSubmission } from "@/v2/data/mockSubmissionsQueue";
import { buildQueueFromSubmission } from "@/v2/data/mockSubmissionsQueue";
import { useJourneyV2 } from "@/v2/hooks/useJourneyV2";

const v2Standalone = import.meta.env.VITE_V2_STANDALONE === "true";
const journeyPath = v2Standalone ? "/journey" : "/v2/journey";
const homePath = v2Standalone ? "/" : "/v2";

function scoreColor(value: number) {
  if (value >= 0.8) return "text-me-green";
  if (value >= 0.7) return "text-me-amber";
  return "text-me-slate";
}

function downloadDraft(filename: string, body: string) {
  const blob = new Blob([body], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function SubmissionsQueuePage() {
  const { state } = useJourneyV2();
  const rows = useMemo(
    () =>
      buildQueueFromSubmission(
        state.manualEntry,
        state.responses,
        state.signatureName,
        state.customerApproval
      ),
    [state.manualEntry, state.responses, state.signatureName, state.customerApproval]
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
            <p className="font-serif text-xl">Partner Evidence Intake Queue</p>
            <p className="text-sm text-me-ice/80">
              Mock reviewer console — scores, files, and Word drafts
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <Link to={homePath} className="text-me-ice hover:underline">Home</Link>
            <Link to={journeyPath} className="text-me-ice hover:underline">New submission</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-4 flex items-center gap-3">
          <SimulatedBadge />
          <p className="text-sm text-me-slate">
            Simulated post-submit view. Nothing is stored on a real backend.
          </p>
        </div>

        {state.submitted && (
          <div
            className="mb-6 rounded-lg border border-me-green/40 bg-me-green/10 px-4 py-3 text-sm text-me-green"
            data-testid="v2-submit-success"
          >
            Story submitted and attested by <strong>{state.signatureName}</strong>. Your row is
            highlighted below.
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-me-line bg-white shadow-sm">
          <table className="w-full text-left text-sm" data-testid="submissions-table">
            <thead className="bg-me-navy text-xs uppercase tracking-wide text-me-ice">
              <tr>
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Engagement</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Sentiment</th>
                <th className="px-4 py-3">Files</th>
                <th className="px-4 py-3">Status</th>
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
                  data-testid={`submission-row-${row.id}`}
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
                  <td className="px-4 py-3 text-me-slate">{row.engagement}</td>
                  <td className={`px-4 py-3 font-medium ${scoreColor(row.valueScore)}`}>
                    {row.valueScore.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-medium text-me-navy">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-me-amber" />
                      {row.sentimentScore.toFixed(1)} / 5
                    </span>
                  </td>
                  <td className="px-4 py-3 text-me-slate">{row.files.length}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        row.status === "Ready for publish"
                          ? "bg-me-green/15 text-me-green"
                          : row.status === "New"
                            ? "bg-me-amber/15 text-me-amber"
                            : "bg-me-card text-me-slate"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <SubmissionDetail submission={selected} onDownload={downloadDraft} />
        )}
      </main>
    </div>
  );
}

function SubmissionDetail({
  submission,
  onDownload,
}: {
  submission: QueueSubmission;
  onDownload: (filename: string, body: string) => void;
}) {
  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-2" data-testid="submission-detail">
      <div className="rounded-lg border border-me-line bg-white p-5">
        <h2 className="font-serif text-lg text-me-navy">Submitted files</h2>
        <p className="mt-1 text-xs text-me-slate">
          Customer approval: {submission.approval}
        </p>
        <ul className="mt-4 space-y-2">
          {submission.files.map((file) => (
            <li key={file.name}>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded border border-me-line px-3 py-2 text-left text-sm hover:bg-me-card"
                data-testid={`file-link-${file.name}`}
              >
                <FileText className="h-4 w-4 text-me-navy" />
                <span className="flex-1">{file.name}</span>
                <span className="text-xs text-me-slate">{file.type}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-lg text-me-navy">Word draft options</h2>
        {submission.drafts.map((draft) => (
          <article
            key={draft.id}
            className="rounded-lg border border-me-line bg-white p-5"
            data-testid={`draft-option-${draft.id}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-me-navy">{draft.label}</p>
                <p className="text-xs text-me-slate">{draft.description}</p>
              </div>
              <button
                type="button"
                onClick={() => onDownload(draft.filename, draft.body)}
                className="inline-flex items-center gap-1 rounded-lg bg-me-navy px-3 py-1.5 text-xs text-white"
                data-testid={`download-${draft.id}`}
              >
                <Download className="h-3.5 w-3.5" />
                Download .docx
              </button>
            </div>
            <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-me-card p-3 text-xs text-me-slate">
              {draft.body}
            </pre>
          </article>
        ))}
      </div>
    </section>
  );
}
