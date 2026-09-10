import { buildDraftAssist } from "@/v2/data/draftAssist";
import type { V2Response } from "@/v2/hooks/useJourneyV2";

export interface CaseStudyDraftOption {
  id: string;
  label: string;
  description: string;
  filename: string;
  body: string;
}

export function buildCaseStudyDraftOptions(
  manual: Record<string, string>,
  responses: Record<string, V2Response>
): CaseStudyDraftOption[] {
  const { draft } = buildDraftAssist(manual, responses);
  const company = manual.companyName || "Partner";
  const customer =
    responses.customer?.value?.split(/[,.]/)[0]?.trim() ||
    manual.engagement?.split(/—| - | for | with /i)[1]?.trim() ||
    "Customer";
  const solution = responses.solution?.value || manual.engagement || "the solution";
  const impact = responses.impact?.value || "measurable business outcomes";
  const tags = responses.tags?.value || "Azure infrastructure, Data and AI";
  const whyMicrosoft =
    responses["why-msft"]?.value ||
    "Microsoft platforms provided the security, scale, and co-sell motion the customer required.";

  const executive = [
    `${company} × ${customer}`,
    "",
    "Headline",
    `${customer} accelerated ${solution.toLowerCase()} with ${company}, delivering ${impact.slice(0, 120)}${impact.length > 120 ? "…" : ""}.`,
    "",
    "Key outcomes",
    `• ${impact}`,
    `• Solution areas: ${tags}`,
    `• Microsoft fit: ${whyMicrosoft.slice(0, 140)}`,
  ].join("\n");

  const full = [
    draft,
    "",
    "Why Microsoft",
    whyMicrosoft,
    "",
    "Proof and artifacts",
    responses.proof?.value ||
      "Supporting materials are attached from the partner submission package.",
    "",
    "Publication tags",
    tags,
  ].join("\n\n");

  return [
    {
      id: "executive",
      label: "Draft A — Executive summary",
      description: "One-page nomination-ready brief for reviewers.",
      filename: `${company.replace(/\s+/g, "-")}-${customer.replace(/\s+/g, "-")}-Executive.docx`,
      body: executive,
    },
    {
      id: "full",
      label: "Draft B — Full case study",
      description: "Long-form Word draft with narrative, quote, and proof sections.",
      filename: `${company.replace(/\s+/g, "-")}-${customer.replace(/\s+/g, "-")}-CaseStudy.docx`,
      body: full,
    },
  ];
}

export function collectSubmissionFiles(
  responses: Record<string, V2Response>
): { name: string; type: string }[] {
  const files: { name: string; type: string }[] = [];
  for (const [section, response] of Object.entries(responses)) {
    response.files?.forEach((name) => {
      files.push({ name, type: section });
    });
    if (response.videoUrl) {
      files.push({ name: `${section}-video-response.webm`, type: "video" });
    }
  }
  return files;
}
