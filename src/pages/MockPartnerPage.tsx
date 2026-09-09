import { Link } from "react-router-dom";

export function MockPartnerPage() {
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
          <h1 className="text-4xl font-semibold">
            Partner success stories
          </h1>
          <p className="mt-4 text-lg text-blue-100">
            Discover how Microsoft partners are delivering real outcomes for
            customers around the world.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-gray-900">
          Featured stories
        </h2>
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
          <p className="text-gray-600">
            Have your own success story to share?
          </p>
          <Link
            to="/journey"
            className="mt-4 inline-block text-[#0078D4] font-medium hover:underline"
            data-testid="share-your-story"
          >
            Share your story →
          </Link>
        </div>
      </footer>
    </div>
  );
}
