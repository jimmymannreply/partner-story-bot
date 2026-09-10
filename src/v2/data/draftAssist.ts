export interface DraftAssistResult {
  draft: string;
  gaps: string[];
  followUps: string[];
}

export function buildDraftAssist(
  manual: Record<string, string>,
  responses: Record<string, { value: string }>
): DraftAssistResult {
  const company = manual.companyName || "the partner";
  const customer =
    responses.customer?.value?.split(/[,.]/)[0]?.trim() ||
    manual.engagement?.split(/—| - | for | with /i)[1]?.trim() ||
    "the customer";
  const solution = responses.solution?.value || manual.engagement || "the solution";
  const impact = responses.impact?.value || "";
  const voice = responses.voice?.value || "";

  const draft = [
    `${company} partnered with ${customer} to deliver ${solution}.`,
    responses.before?.value
      ? `Before the engagement, ${responses.before.value}`
      : "The customer faced operational friction that slowed adoption of modern workloads.",
    impact
      ? `After implementation, ${impact}`
      : "The team reported measurable improvements in speed, reliability, and stakeholder confidence.",
    voice
      ? `A customer sponsor noted: "${voice.slice(0, 180)}${voice.length > 180 ? "…" : ""}"`
      : "Customer voice is captured in the interview and can be strengthened with a verbatim quote.",
  ].join("\n\n");

  const gaps: string[] = [];
  if (!impact || impact.length < 40) {
    gaps.push("No hard number for cost savings or time-to-value in the impact section.");
  }
  if (!voice || voice.length < 30) {
    gaps.push("Customer quote not yet confirmed — add a named sponsor quote.");
  }
  const proof = responses.proof as { value?: string; files?: string[] } | undefined;
  if (!proof?.value && !proof?.files?.length) {
    gaps.push("Proof artifacts missing — upload a dashboard, report, or deployment log.");
  }
  if (gaps.length === 0) {
    gaps.push("Tags could be more specific to solution area and Microsoft products used.");
  }

  const followUps = [
    "Can you share one metric the customer tracks monthly post-go-live?",
    "Who is the executive sponsor we can name in the published story?",
    "Which Microsoft SKU or service consumption grew because of this win?",
  ];

  return { draft, gaps: gaps.slice(0, 3), followUps: followUps.slice(0, 3) };
}
