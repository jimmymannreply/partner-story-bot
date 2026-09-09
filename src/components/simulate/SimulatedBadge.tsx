export function SimulatedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-dl-warning-bg px-2.5 py-0.5 text-xs font-medium text-dl-warning ${className}`}
    >
      Simulated for demo
    </span>
  );
}
