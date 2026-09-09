import type { PartnerProfile } from "./mockPartnerData";
import type { Engagement } from "./mockPartnerData";

export interface EngagementDetails extends Engagement {
  source: "engagement" | "sale" | "mci";
  industry?: string;
  customerSize?: string;
  solutionName?: string;
  technologies?: string;
  beforeState?: string;
  impact?: string;
  whyMsft?: string;
  tags?: string;
}

export const mciEngagements: EngagementDetails[] = [
  {
    id: "mci-1",
    name: "MCI — Fabrikam Azure AI consumption",
    customer: "Fabrikam Industries",
    date: "2026-06-15",
    type: "engagement",
    source: "mci",
    industry: "Manufacturing",
    customerSize: "Enterprise (1,000+ employees)",
    solutionName: "Fabrikam Intelligent Factory Platform",
    technologies: "Azure OpenAI, Azure Machine Learning, IoT Hub, Cosmos DB",
    beforeState:
      "Manual quality inspections took 4 hours per batch with 12% defect escape rate.",
    impact:
      "Cut inspection time from 4 hours to 45 minutes; defect rate dropped to 2%.",
    whyMsft:
      "Azure AI Foundry gave us enterprise-grade models with the compliance Fabrikam required.",
    tags: "Data and AI, Azure infrastructure, Manufacturing",
  },
];

export const enrichedEngagements: EngagementDetails[] = [
  {
    id: "eng-1",
    name: "Azure AI migration for Fabrikam",
    customer: "Fabrikam Industries",
    date: "2026-06-15",
    type: "engagement",
    source: "engagement",
    industry: "Manufacturing",
    customerSize: "Enterprise (1,000+ employees)",
    solutionName: "Fabrikam Cloud Migration Suite",
    technologies: "Azure Migrate, Azure SQL, Azure Kubernetes Service",
    beforeState:
      "Legacy on-premises workloads caused 6-week deployment cycles and rising ops costs.",
    impact: "Deployment cycles reduced from 6 weeks to 10 days; ops cost down 35%.",
    whyMsft:
      "Microsoft's migration tooling and partner support made a complex lift-and-shift achievable in one quarter.",
    tags: "Azure infrastructure, Digital and app innovation",
  },
  {
    id: "eng-2",
    name: "Copilot rollout — Northwind Traders",
    customer: "Northwind Traders",
    date: "2026-05-22",
    type: "engagement",
    source: "engagement",
    industry: "Retail",
    customerSize: "Mid-market (100–300 employees)",
    solutionName: "Northwind Copilot for Sales",
    technologies: "Microsoft 365 Copilot, Microsoft Graph, Power Platform",
    beforeState:
      "Sales reps spent 2+ hours daily on admin tasks instead of selling.",
    impact: "Admin time cut by 60%; pipeline velocity up 25% in 90 days.",
    whyMsft:
      "Copilot embedded in the tools reps already used—no new app to learn.",
    tags: "Modern work, Digital and app innovation",
  },
  {
    id: "sale-1",
    name: "Azure OpenAI — Adventure Works",
    customer: "Adventure Works",
    date: "2026-07-01",
    type: "sale",
    source: "sale",
    industry: "Outdoor recreation",
    customerSize: "Mid-market (50–200 employees)",
    solutionName: "Adventure Works AI Customer Assistant",
    technologies: "Azure OpenAI, Azure AI Search, App Service",
    beforeState:
      "Customer support wait times averaged 18 minutes during peak season.",
    impact: "Wait times dropped to under 3 minutes; CSAT rose from 72% to 91%.",
    whyMsft:
      "Azure OpenAI plus our custom RAG layer delivered accurate answers from Adventure Works' product catalog.",
    tags: "Data and AI, Azure infrastructure",
  },
  {
    id: "sale-2",
    name: "Foundry agents — Tailspin Toys",
    customer: "Tailspin Toys",
    date: "2026-04-18",
    type: "sale",
    source: "sale",
    industry: "Consumer goods",
    customerSize: "Small business (under 50 employees)",
    solutionName: "Tailspin Inventory Agent",
    technologies: "Azure AI Foundry, Azure Functions, Azure SQL",
    beforeState: "Inventory forecasting was manual spreadsheets updated weekly.",
    impact: "Stockouts reduced 40%; overstock carrying cost down $120K annually.",
    whyMsft:
      "Foundry agents let us deploy autonomous workflows without building infrastructure from scratch.",
    tags: "Data and AI, High-impact AI use case",
  },
];

export function buildProfilePrefill(profile: PartnerProfile): Record<string, string> {
  const designations = "Solutions Partner — Data & AI, Infrastructure, Security";
  return {
    "about-you": `Company: ${profile.companyName} (Partner ID ${profile.partnerId}), headquartered in ${profile.headquarters}. Website: ${profile.website}. Company size: ${profile.companySize}. Solutions Partner designations: ${designations}.`,
    tags: "Data and AI, Azure infrastructure",
  };
}

export function buildEngagementPrefill(eng: EngagementDetails): Record<string, string> {
  return {
    customer: `Customer: ${eng.customer}. Industry: ${eng.industry ?? "—"}. Size: ${eng.customerSize ?? "—"}. Approval status: Pending approval.`,
    solution: `Solution: ${eng.solutionName ?? eng.name}. Microsoft technologies: ${eng.technologies ?? "Azure"}. Implemented approximately 6 months.`,
    before: eng.beforeState ?? "",
    impact: eng.impact ?? "",
    "why-msft": eng.whyMsft ?? "",
    tags: eng.tags ?? "",
    voice: `Customer contact at ${eng.customer} — title and quote to be confirmed.`,
  };
}

export const scriptQuestions = [
  { section: "Supporting materials", question: "Do you already have customer quotes, logos, screenshots, videos, or a drafted case study?" },
  { section: "About you and your solution", question: "What is your company, solution name, partner type, designations, and marketplace listing?" },
  { section: "About the customer", question: "What is the customer's name, industry, size, and approval status for sharing?" },
  { section: "The before state", question: "What was the customer struggling with before this engagement?" },
  { section: "The solution", question: "What did you build, and which Microsoft technologies does it use?" },
  { section: "The impact", question: "What changed for the customer and your business? Include numbers if possible." },
  { section: "Why Microsoft plus your solution", question: "Why does Microsoft and your solution deliver more together?" },
  { section: "The proof", question: "Upload artifacts that back up your headline numbers." },
  { section: "Customer and partner voice", question: "Who can be quoted, and what did they say in their own words?" },
  { section: "Context tags", question: "Which solution area, products, and industry tags apply?" },
  { section: "Sentiment check", question: "How would you describe the customer's enthusiasm in their own words?" },
];
