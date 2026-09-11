import { Link } from "react-router-dom";

export function LandingPageV2() {
  return (
    <div className="min-h-screen bg-me-navy-dark text-white">
      <header className="border-b border-white/10 px-6 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <p className="font-serif text-lg">Partner Story Bot V2</p>
          {!import.meta.env.VITE_V2_STANDALONE && (
            <div className="flex gap-3 text-sm">
              <Link to="/v3" className="text-me-ice hover:underline">V3 voice-first</Link>
              <Link to="/" className="text-me-ice hover:underline">V1 demo</Link>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-serif text-4xl leading-tight">
          Have a win? Tell us about your experience.
        </h1>
        <p className="mt-4 text-lg text-me-ice">
          No account needed — just tell us what happened.
        </p>
        <Link
          to={import.meta.env.VITE_V2_STANDALONE ? "/journey" : "/v2/journey"}
          className="mt-10 inline-block rounded-lg bg-me-navy px-8 py-3 font-medium text-white ring-2 ring-me-ice/30 hover:bg-me-navy/90"
          data-testid="v2-start-my-story"
        >
          Start my story
        </Link>
      </main>
    </div>
  );
}
