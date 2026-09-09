export interface PartnerProfile {
  companyName: string;
  partnerId: string;
  headquarters: string;
  website: string;
  companySize: string;
  role: string;
}

export interface Designation {
  id: string;
  name: string;
  valid: boolean;
}

export interface Engagement {
  id: string;
  name: string;
  customer: string;
  date: string;
  type: "engagement" | "sale";
}

export const mockPartnerProfile: PartnerProfile = {
  companyName: "Contoso Solutions",
  partnerId: "PC-4829103",
  headquarters: "United States",
  website: "https://contoso.com",
  companySize: "Medium (50–250 employees)",
  role: "Partner Marketing Lead",
};

export const mockDesignations: Designation[] = [
  { id: "data-ai", name: "Solutions Partner — Data & AI", valid: true },
  { id: "infra", name: "Solutions Partner — Infrastructure", valid: true },
  { id: "security", name: "Solutions Partner — Security", valid: true },
];

export const designationCatalog = [
  "Solutions Partner — Data & AI",
  "Solutions Partner — Infrastructure",
  "Solutions Partner — Security",
  "Solutions Partner — Digital & App Innovation",
  "Solutions Partner — Modern Work",
  "Specialization — Azure Kubernetes Service",
  "Specialization — AI Platform",
];

export const mockEngagements: Engagement[] = [
  {
    id: "eng-1",
    name: "Azure AI migration for Fabrikam",
    customer: "Fabrikam Industries",
    date: "2026-06-15",
    type: "engagement",
  },
  {
    id: "eng-2",
    name: "Copilot rollout — Northwind Traders",
    customer: "Northwind Traders",
    date: "2026-05-22",
    type: "engagement",
  },
  {
    id: "sale-1",
    name: "Azure OpenAI — Adventure Works",
    customer: "Adventure Works",
    date: "2026-07-01",
    type: "sale",
  },
  {
    id: "sale-2",
    name: "Foundry agents — Tailspin Toys",
    customer: "Tailspin Toys",
    date: "2026-04-18",
    type: "sale",
  },
];

export const customerApprovalStates = [
  "Approved for public use",
  "Pending approval",
  "Not approved",
  "Unknown",
] as const;

export type CustomerApprovalState = (typeof customerApprovalStates)[number];
