import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { RubricAnchor } from "@/data/rubricAnchors";

interface GoodLooksLikeProps {
  anchor: RubricAnchor;
}

export function GoodLooksLike({ anchor }: GoodLooksLikeProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 rounded-dl border border-dl-border bg-dl-page/50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-dl-text"
      >
        What good looks like — {anchor.dimension}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="space-y-2 border-t border-dl-border px-3 py-2 text-xs">
          <div>
            <span className="font-semibold text-red-700">Score 1: </span>
            <span className="text-dl-text-secondary">{anchor.score1}</span>
          </div>
          <div>
            <span className="font-semibold text-dl-success">Score 5: </span>
            <span className="text-dl-text-secondary">{anchor.score5}</span>
          </div>
        </div>
      )}
    </div>
  );
}
