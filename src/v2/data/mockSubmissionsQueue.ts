import type { CustomerApprovalState } from "@/data/mockPartnerData";
import {
  buildCaseStudyDraftOptions,
  collectSubmissionFiles,
} from "@/v2/data/caseStudyDrafts";
import type { V2Response } from "@/v2/hooks/useJourneyV2";

export interface QueueSubmission {
  id: string;
  partner: string;
  customer: string;
  engagement: string;
  submittedAt: string;
  valueScore: number;
  sentimentScore: number;
  status: "New" | "In review" | "Ready for publish";
  approval: CustomerApprovalState;
  files: { name: string; type: string }[];
  drafts: ReturnType<typeof buildCaseStudyDraftOptions>;
  isCurrent?: boolean;
}

const seedSubmissions: Omit<QueueSubmission, "drafts" | "files">[] = [
  {
    id: "sub-001",
    partner: "Northwind Analytics",
    customer: "Adventure Works",
    engagement: "Copilot rollout for sales enablement",
    submittedAt: "2026-09-08T14:22:00Z",
    valueScore: 0.82,
    sentimentScore: 4.4,
    status: "Ready for publish",
    approval: "Approved for public use",
  },
  {
    id: "sub-002",
    partner: "Tailspin Cloud",
    customer: "Fabrikam Industries",
    engagement: "Azure AI migration and model fine-tuning",
    submittedAt: "2026-09-07T09:10:00Z",
    valueScore: 0.76,
    sentimentScore: 4.1,
    status: "In review",
    approval: "Pending approval",
  },
  {
    id: "sub-003",
    partner: "Contoso Solutions",
    customer: "Northwind Traders",
    engagement: "Foundry agents for customer support",
    submittedAt: "2026-09-05T16:45:00Z",
    valueScore: 0.71,
    sentimentScore: 3.9,
    status: "In review",
    approval: "Unknown",
  },
];

const seedFiles: Record<string, { name: string; type: string }[]> = {
  "sub-001": [
    { name: "adventure-works-copilot-roi.xlsx", type: "proof" },
    { name: "customer-quote-adventure-works.txt", type: "voice" },
  ],
  "sub-002": [
    { name: "fabrikam-ai-migration-architecture.pdf", type: "materials" },
    { name: "fabrikam-dashboard-screenshot.png", type: "proof" },
    { name: "fabrikam-sponsor-video.webm", type: "video" },
  ],
  "sub-003": [
    { name: "northwind-agent-demo.mp4", type: "materials" },
  ],
};

const seedDrafts: Record<string, ReturnType<typeof buildCaseStudyDraftOptions>> = {
  "sub-001": [
    {
      id: "executive",
      label: "Draft A — Executive summary",
      description: "Nomination brief.",
      filename: "Northwind-AdventureWorks-Executive.docx",
      body: "Adventure Works deployed Copilot with Northwind Analytics, cutting proposal turnaround time by 38% in the first quarter.",
    },
    {
      id: "full",
      label: "Draft B — Full case study",
      description: "Long-form narrative.",
      filename: "Northwind-AdventureWorks-CaseStudy.docx",
      body: "Adventure Works partnered with Northwind Analytics to roll out Microsoft Copilot across 420 sellers...",
    },
  ],
  "sub-002": [
    {
      id: "executive",
      label: "Draft A — Executive summary",
      description: "Nomination brief.",
      filename: "Tailspin-Fabrikam-Executive.docx",
      body: "Fabrikam Industries modernized inference workloads on Azure OpenAI with Tailspin Cloud.",
    },
    {
      id: "full",
      label: "Draft B — Full case study",
      description: "Long-form narrative.",
      filename: "Tailspin-Fabrikam-CaseStudy.docx",
      body: "Fabrikam faced model drift and compliance risk in their on-prem AI stack...",
    },
  ],
  "sub-003": [
    {
      id: "executive",
      label: "Draft A — Executive summary",
      description: "Nomination brief.",
      filename: "Contoso-Northwind-Executive.docx",
      body: "Northwind Traders launched Foundry-based support agents with Contoso Solutions.",
    },
    {
      id: "full",
      label: "Draft B — Full case study",
      description: "Long-form narrative.",
      filename: "Contoso-Northwind-CaseStudy.docx",
      body: "Northwind Traders needed faster resolution paths without expanding headcount...",
    },
  ],
};

export function buildQueueFromSubmission(
  manual: Record<string, string>,
  responses: Record<string, V2Response>,
  signatureName: string,
  approval: CustomerApprovalState
): QueueSubmission[] {
  const files = collectSubmissionFiles(responses);
  if (files.length === 0) {
    files.push(
      { name: "partner-submission-notes.txt", type: "materials" },
      { name: "interview-transcript.json", type: "capture" }
    );
  }

  const hasVideo = Object.values(responses).some((r) => r.videoUrl);
  const valueScore = Math.min(
    0.92,
    0.62 +
      (Object.keys(responses).length / 14) * 0.15 +
      (files.length > 2 ? 0.08 : 0) +
      (hasVideo ? 0.05 : 0)
  );
  const sentimentScore = Math.min(
    5,
    3.6 + (responses.sentiment?.value?.length ?? 0) / 80
  );

  const current: QueueSubmission = {
    id: "sub-current",
    partner: manual.companyName || signatureName || "Submitted partner",
    customer:
      responses.customer?.value?.split(/[,.]/)[0]?.trim() ||
      manual.engagement?.split(/—| - | for | with /i)[1]?.trim() ||
      "Customer TBD",
    engagement: manual.engagement || responses.solution?.value || "Partner win",
    submittedAt: new Date().toISOString(),
    valueScore: Math.round(valueScore * 100) / 100,
    sentimentScore: Math.round(sentimentScore * 10) / 10,
    status: "New",
    approval,
    files,
    drafts: buildCaseStudyDraftOptions(manual, responses),
    isCurrent: true,
  };

  const seeded = seedSubmissions.map((row) => ({
    ...row,
    files: seedFiles[row.id] ?? [],
    drafts: seedDrafts[row.id] ?? [],
  }));

  return [current, ...seeded];
}
