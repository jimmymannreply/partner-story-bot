import { Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JourneyAction } from "@/data/journeyStages";
import { getRubricForAction } from "@/data/journeyStages";
import { GoodLooksLike } from "./GoodLooksLike";
import { ActionInput } from "./ActionInput";

interface ActionCardProps {
  action: JourneyAction;
  stageId: string;
  isComplete: boolean;
  isActive: boolean;
  onActivate: () => void;
  onNext: () => void;
}

export function ActionCard({
  action,
  isComplete,
  isActive,
  onActivate,
  onNext,
}: ActionCardProps) {
  const rubric = getRubricForAction(action);

  return (
    <div
      className={cn(
        "rounded-dl border p-5 transition-colors",
        isComplete
          ? "border-green-200 bg-dl-success-bg/30"
          : isActive
            ? "border-dl-border bg-dl-surface shadow-card"
            : "border-dl-border bg-dl-surface opacity-70"
      )}
      data-testid={`action-${action.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border",
              isComplete
                ? "border-dl-success bg-dl-success text-white"
                : "border-dl-border bg-white"
            )}
          >
            {isComplete && <Check size={14} />}
          </div>
          <div className="flex-1">
            <h3
              className={cn(
                "font-semibold",
                isComplete ? "text-dl-success" : "text-dl-text"
              )}
            >
              {action.title}
            </h3>
            <p className="mt-1 text-sm text-dl-text-secondary">
              {action.description}
            </p>
          </div>
        </div>
        <div className="shrink-0">
          {isComplete ? (
            <span className="rounded-full bg-dl-success-bg px-3 py-1 text-xs font-medium text-dl-success">
              Complete
            </span>
          ) : isActive ? (
            <button
              type="button"
              onClick={onNext}
              className="rounded-full bg-dl-brand px-4 py-1.5 text-xs font-medium text-white hover:bg-dl-brand-hover"
              data-testid={`next-${action.id}`}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={onActivate}
              className="text-xs text-dl-brand hover:underline"
            >
              Open
            </button>
          )}
        </div>
      </div>

      {action.resourceLabel && (
        <a
          href={action.resourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs text-dl-brand hover:underline"
        >
          {action.resourceLabel} <ExternalLink size={12} />
        </a>
      )}

      {rubric && <GoodLooksLike anchor={rubric} />}

      {(isActive || isComplete) && <ActionInput action={action} />}
    </div>
  );
}
