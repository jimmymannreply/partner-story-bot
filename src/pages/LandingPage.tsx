import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-dl-page">
      <header className="border-b border-dl-border bg-dl-surface px-6 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              <div className="h-3 w-3 rounded-sm bg-[#F25022]" />
              <div className="h-3 w-3 rounded-sm bg-[#7FBA00]" />
              <div className="h-3 w-3 rounded-sm bg-[#00A4EF]" />
              <div className="h-3 w-3 rounded-sm bg-[#FFB900]" />
            </div>
            <span className="font-semibold">Partner Story Bot</span>
          </div>
          <Link
            to="/partner"
            className="text-sm text-dl-text-secondary hover:text-dl-brand"
          >
            Partner success stories
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold text-dl-text">
          Have a win? Tell us about your experience.
        </h1>
        <p className="mt-4 text-lg text-dl-text-secondary">
          Turn your partner success into evidence that powers case studies,
          nomination fit checks, and the Evidence Engine.
        </p>
        <Link
          to="/journey"
          className="mt-8 inline-block rounded-dl bg-dl-brand px-8 py-3 text-base font-medium text-white hover:bg-dl-brand-hover"
          data-testid="start-my-story"
        >
          Start my story
        </Link>
        <p className="mt-6 text-sm text-dl-text-secondary">
          Or try the{" "}
          <Link to="/v2" className="text-dl-brand hover:underline">
            V2 no-login demo
          </Link>
          {" · "}
          <Link to="/partner" className="text-dl-brand hover:underline">
            partner success stories page
          </Link>
        </p>
      </main>
    </div>
  );
}
