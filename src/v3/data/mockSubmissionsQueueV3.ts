import {
  buildCaseStudyDraftOptions,
  collectSubmissionFiles,
} from "@/v2/data/caseStudyDrafts";
import type { V3Response } from "@/v3/hooks/useJourneyV3";

export interface QueueSubmissionV3 {
  id: string;
  partner: string;
  customer: string;
  engagement: string;
  microsoftContact: string;
  submittedAt: string;
  valueScore: number;
  sentimentScore: number;
  priorityScore: number;
  status: "New" | "In review" | "Ready for publish";
  files: { name: string; type: string }[];
  drafts: ReturnType<typeof buildCaseStudyDraftOptions>;
  isCurrent?: boolean;
}

const seeds: Omit<QueueSubmissionV3, "drafts" | "files">[] = [
  {
    id: "v3-001",
    partner: "Lamna Healthcare",
    customer: "City General Hospital",
    engagement: "Copilot for clinical documentation",
    microsoftContact: "Alex Rivera, PDM",
    submittedAt: "2026-09-10T11:00:00Z",
    valueScore: 0.84,
    sentimentScore: 4.5,
    priorityScore: 4,
    status: "Ready for publish",
  },
  {
    id: "v3-002",
    partner: "Blue Yonder Analytics",
    customer: "RetailCo",
    engagement: "Demand forecasting on Azure ML",
    microsoftContact: "Priya Nair, Account TE",
    submittedAt: "2026-09-09T15:30:00Z",
    valueScore: 0.79,
    sentimentScore: 4.2,
    priorityScore: 4,
    status: "In review",
  },
];

export function buildV3Queue(
  microsoftContact: string,
  responses: Record<string, V3Response>
): QueueSubmissionV3[] {
  const manual = {
    companyName: responses["about-you"]?.value?.split(/[,.]/)[0] || "Voice submission",
    engagement: responses.solution?.value || "Partner win",
  };
  const files = collectSubmissionFiles(responses);
  const drafts = buildCaseStudyDraftOptions(manual, responses);

  const current: QueueSubmissionV3 = {
    id: "v3-current",
    partner: responses["about-you"]?.value?.slice(0, 40) || "Voice-first submitter",
    customer: responses.customer?.value?.split(/[,.]/)[0]?.trim() || "Customer TBD",
    engagement: responses.solution?.value || "Solution capture",
    microsoftContact,
    submittedAt: new Date().toISOString(),
    valueScore: 0.81,
    sentimentScore: 4.3,
    priorityScore: 4,
    status: "New",
    files: files.length ? files : [{ name: "voice-transcript.json", type: "capture" }],
    drafts,
    isCurrent: true,
  };

  const seeded = seeds.map((row) => ({
    ...row,
    files: [{ name: `${row.id}-package.zip`, type: "capture" }],
    drafts: buildCaseStudyDraftOptions(
      { companyName: row.partner, engagement: row.engagement },
      {}
    ),
  }));

  return [current, ...seeded];
}
