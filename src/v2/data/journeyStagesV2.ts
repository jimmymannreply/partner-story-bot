import { interviewPrompts } from "@/data/interviewScript";

export type V2InputType =
  | "manual-entry"
  | "consent"
  | "text"
  | "upload"
  | "draft-assist"
  | "review"
  | "attest";

export interface V2Action {
  id: string;
  title: string;
  description: string;
  inputType: V2InputType;
  prompt?: string;
  stepLabel?: string;
}

export interface V2Stage {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  actions: V2Action[];
}

const captureActions: V2Action[] = [
  {
    id: "materials",
    title: "Materials",
    stepLabel: "1",
    description: "Upload supporting materials",
    inputType: "upload",
    prompt: interviewPrompts.materials,
  },
  {
    id: "about-you",
    title: "About You",
    stepLabel: "2",
    description: "Company and solution",
    inputType: "text",
    prompt: interviewPrompts.aboutYou,
  },
  {
    id: "customer",
    title: "Customer",
    stepLabel: "3",
    description: "About the customer",
    inputType: "text",
    prompt: interviewPrompts.customer,
  },
  {
    id: "before",
    title: "Before",
    stepLabel: "4",
    description: "The before state",
    inputType: "text",
    prompt: interviewPrompts.before,
  },
  {
    id: "solution",
    title: "Solution",
    stepLabel: "5",
    description: "What you built",
    inputType: "text",
    prompt: interviewPrompts.solution,
  },
  {
    id: "impact",
    title: "Impact",
    stepLabel: "6",
    description: "Quantified outcomes",
    inputType: "text",
    prompt: interviewPrompts.impact,
  },
  {
    id: "why-msft",
    title: "Why MSFT",
    stepLabel: "7",
    description: "Why Microsoft plus your solution",
    inputType: "text",
    prompt: interviewPrompts.whyMsft,
  },
  {
    id: "proof",
    title: "Proof",
    stepLabel: "8",
    description: "Artifacts that back up your numbers",
    inputType: "upload",
    prompt: interviewPrompts.proof,
  },
  {
    id: "voice",
    title: "Voice",
    stepLabel: "9",
    description: "Customer and partner voice",
    inputType: "text",
    prompt: interviewPrompts.voice,
  },
  {
    id: "tags",
    title: "Tags",
    stepLabel: "10",
    description: "Solution area and tags",
    inputType: "text",
    prompt: interviewPrompts.tags,
  },
  {
    id: "sentiment",
    title: "Sentiment",
    stepLabel: "11",
    description: "Customer enthusiasm",
    inputType: "text",
    prompt: interviewPrompts.sentiment,
  },
];

export const adaptivePromptOverrides: Record<string, string> = {
  impact:
    "For a migration story: what changed in the first 90 days? Include any cost, time, or risk metrics—even directional estimates help.",
  voice:
    "For a migration story: who sponsored the project and what did they say when go-live succeeded? Use their exact words if you can.",
};

export const journeyStagesV2: V2Stage[] = [
  {
    id: "setup",
    number: "01",
    label: "SETUP",
    title: "Tell us about your win",
    description: "Manual entry and consent — no account required.",
    actions: [
      {
        id: "manual-entry",
        title: "Manual entry",
        description: "Company name, headquarters, and engagement details.",
        inputType: "manual-entry",
      },
      {
        id: "accept-consent",
        title: "Consent & sign-off",
        description: "Affidavit and customer approval status.",
        inputType: "consent",
      },
    ],
  },
  {
    id: "capture",
    number: "02",
    label: "INTERVIEW",
    title: "Guided interview",
    description: "Eleven script sections with type-or-record answers.",
    actions: captureActions,
  },
  {
    id: "draft",
    number: "03",
    label: "DRAFT",
    title: "Draft Assist reveal",
    description: "Starting draft, gaps flagged, and follow-up questions.",
    actions: [
      {
        id: "draft-assist",
        title: "Draft Assist",
        description: "Agent reads your submission and surfaces a starting draft.",
        inputType: "draft-assist",
      },
    ],
  },
  {
    id: "review",
    number: "04",
    label: "REVIEW",
    title: "Review and attest",
    description: "Recap, lightweight attestation, and submit.",
    actions: [
      {
        id: "recap",
        title: "Review all sections",
        description: "Collapsible recap of every answer.",
        inputType: "review",
      },
      {
        id: "attest",
        title: "Attest and submit",
        description: "Confirm accuracy and type your name.",
        inputType: "attest",
      },
    ],
  },
];

export const manualEntryQuestions = [
  { id: "companyName", label: "company name", prompt: "What is your company name?" },
  { id: "headquarters", label: "headquarters", prompt: "Where is your company headquartered?" },
  { id: "companySize", label: "company size", prompt: "Roughly how large is your company?" },
  {
    id: "engagement",
    label: "engagement",
    prompt: "Describe the engagement or win in your own words — include the customer name.",
  },
];
