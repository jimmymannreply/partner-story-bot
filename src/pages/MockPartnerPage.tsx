import { useState } from "react";
import { Link } from "react-router-dom";
import { scriptQuestions } from "@/data/prefillData";
import { X } from "lucide-react";

export function MockPartnerPage() {
  const [showScript, setShowScript] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Microsoft</span>
            <span className="text-lg font-semibold">Partner</span>
          </div>
          <nav className="hidden gap-6 text-sm text-gray-600 md:flex">
            <span>Explore</span>
            <span>Products</span>
            <span>Solutions</span>
            <span className="font-medium text-gray-900">Partners</span>
            <span>Resources</span>
          </nav>
          <button className="rounded bg-[#0078D4] px-4 py-2 text-sm text-white">
            Sign in
          </button>
        </div>
      </header>

      <section className="bg-gradient-to-br from-[#0078D4] to-[#004578] px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-semibold">Partner success stories</h1>
          <p className="mt-4 text-lg text-blue-100">
            Discover how Microsoft partners are delivering real outcomes for
            customers around the world.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-gray-900">Featured stories</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {["Fabrikam AI migration", "Northwind Copilot rollout"].map(
            (title) => (
              <div
                key={title}
                className="rounded-lg border border-gray-200 p-6 shadow-sm"
              >
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  See how partners are driving measurable outcomes with Azure
                  and AI.
                </p>
              </div>
            )
          )}
        </div>
      </section>

      <footer className="border-t bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-gray-600">Have your own success story to share?</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
            <Link
              to="/journey"
              className="text-[#0078D4] font-medium hover:underline"
              data-testid="share-your-story"
            >
              Share your story →
            </Link>
            <button
              type="button"
              onClick={() => setShowScript(true)}
              className="text-[#0078D4] font-medium hover:underline"
              data-testid="preview-script"
            >
              Preview the script
            </button>
          </div>
        </div>
      </footer>

      {showScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
            data-testid="script-preview-modal"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">Interview script preview</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Questions you'll be asked when sharing your partner success story.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowScript(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <ol className="mt-6 space-y-4">
              {scriptQuestions.map((q, i) => (
                <li key={q.section} className="border-b border-gray-100 pb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0078D4]">
                    {String(i + 1).padStart(2, "0")} · {q.section}
                  </p>
                  <p className="mt-1 text-sm text-gray-800">{q.question}</p>
                </li>
              ))}
            </ol>
            <Link
              to="/journey"
              className="mt-6 inline-block rounded bg-[#0078D4] px-6 py-2 text-sm text-white"
              onClick={() => setShowScript(false)}
            >
              Start my story
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
