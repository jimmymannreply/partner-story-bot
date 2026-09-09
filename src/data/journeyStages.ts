import { rubricAnchors } from "./rubricAnchors";
import { interviewPrompts } from "./interviewScript";

export type ActionInputType =
  | "oauth"
  | "confirm"
  | "designations"
  | "engagement"
  | "consent"
  | "text"
  | "upload"
  | "customer-invite"
  | "review"
  | "attest"
  | "engine";

export interface JourneyAction {
  id: string;
  title: string;
  description: string;
  inputType: ActionInputType;
  rubricKey?: string;
  prompt?: string;
  resourceLabel?: string;
  resourceUrl?: string;
}

export interface JourneyStage {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  actions: JourneyAction[];
}

export const journeyStages: JourneyStage[] = [
  {
    id: "collect",
    number: "01",
    label: "COLLECT",
    title: "Collect context",
    description:
      "Sign in, confirm what we already know, select your win, and accept consent.",
    actions: [
      {
        id: "sign-in",
        title: "Sign in to Partner Center",
        description: "Authenticate with your Microsoft partner account.",
        inputType: "oauth",
      },
      {
        id: "confirm-profile",
        title: "Confirm what we already know",
        description:
          "Review your company profile pre-filled from Partner Center.",
        inputType: "confirm",
      },
      {
        id: "confirm-designations",
        title: "Confirm Solutions Partner designations",
        description:
          "Validate your Skilling Hub designations or add more.",
        inputType: "designations",
        rubricKey: "metadataCompleteness",
      },
      {
        id: "select-win",
        title: "Select your win",
        description:
          "Choose an engagement or closed-won sale, or add your own.",
        inputType: "engagement",
      },
      {
        id: "accept-consent",
        title: "Accept consent and permissions",
        description:
          "Confirm affidavit acceptance and customer approval status.",
        inputType: "consent",
      },
    ],
  },
  {
    id: "capture",
    number: "02",
    label: "CAPTURE",
    title: "Capture your story",
    description:
      "Answer guided questions that map directly to the evidence scoring rubric.",
    actions: [
      {
        id: "materials",
        title: "Upload supporting materials",
        description:
          "Share existing quotes, logos, screenshots, videos, or a drafted case study.",
        inputType: "upload",
        rubricKey: "proofLinkage",
        prompt: interviewPrompts.materials,
        resourceLabel: "See nomination form field guide",
        resourceUrl:
          "https://partner.microsoft.com/en-us/connect/partner-success-story-nomination",
      },
      {
        id: "about-you",
        title: "About you and your solution",
        description:
          "Company details, solution name, partner type, and marketplace listing.",
        inputType: "text",
        rubricKey: "metadataCompleteness",
        prompt: interviewPrompts.aboutYou,
      },
      {
        id: "customer",
        title: "About the customer",
        description:
          "Customer name, industry, size, and approval status for sharing.",
        inputType: "text",
        rubricKey: "sourceCredibility",
        prompt: interviewPrompts.customer,
      },
      {
        id: "before",
        title: "The before state",
        description:
          "What was the customer struggling with before this engagement?",
        inputType: "text",
        rubricKey: "problemBeforeState",
        prompt: interviewPrompts.before,
      },
      {
        id: "solution",
        title: "The solution you built",
        description:
          "What you built and which Microsoft technologies it uses.",
        inputType: "text",
        rubricKey: "msTechnologyFit",
        prompt: interviewPrompts.solution,
      },
      {
        id: "impact",
        title: "The impact",
        description:
          "Quantified outcomes for the customer and your business.",
        inputType: "text",
        rubricKey: "outcomeSpecificity",
        prompt: interviewPrompts.impact,
      },
      {
        id: "why-msft",
        title: "Why Microsoft plus your solution",
        description: "Why Microsoft and your solution deliver more together.",
        inputType: "text",
        prompt: interviewPrompts.whyMsft,
      },
      {
        id: "proof",
        title: "The proof",
        description:
          "Upload artifacts that back up your headline numbers.",
        inputType: "upload",
        rubricKey: "proofLinkage",
        prompt: interviewPrompts.proof,
      },
      {
        id: "voice",
        title: "Customer and partner voice",
        description:
          "Named quotes with titles—unpolished phrasing preferred.",
        inputType: "text",
        rubricKey: "quoteAuthenticity",
        prompt: interviewPrompts.voice,
      },
      {
        id: "tags",
        title: "Context tags",
        description: "Solution area, products, and industry tags.",
        inputType: "text",
        rubricKey: "metadataCompleteness",
        prompt: interviewPrompts.tags,
      },
      {
        id: "sentiment",
        title: "Sentiment check",
        description:
          "How would you describe the customer's enthusiasm in their own words?",
        inputType: "text",
        rubricKey: "sentiment",
        prompt: interviewPrompts.sentiment,
      },
    ],
  },
  {
    id: "voice",
    number: "03",
    label: "VOICE",
    title: "Customer voice",
    description:
      "Optionally invite your customer to record a verbatim testimonial.",
    actions: [
      {
        id: "invite-customer",
        title: "Invite customer contacts",
        description:
          "Add customer emails to receive a consent link and recording prompt.",
        inputType: "customer-invite",
      },
      {
        id: "customer-record",
        title: "Customer records video or voice",
        description:
          "Customer logs in and submits a video or voice recording with consent.",
        inputType: "text",
        rubricKey: "quoteAuthenticity",
      },
      {
        id: "customer-received",
        title: "Review customer submission",
        description: "Confirm the customer's verbatim has been received.",
        inputType: "text",
      },
    ],
  },
  {
    id: "review",
    number: "04",
    label: "REVIEW",
    title: "Review and submit",
    description:
      "Recap your submission, attest, and see what happens behind the scenes.",
    actions: [
      {
        id: "recap",
        title: "Review all sections",
        description: "Collapsible recap of every stage with gaps flagged.",
        inputType: "review",
      },
      {
        id: "attest",
        title: "Attest and sign",
        description:
          "Confirm accuracy, type your name, and draw your signature.",
        inputType: "attest",
      },
      {
        id: "submit-engine",
        title: "Submit and see what happens next",
        description:
          "Watch the Collect → Validate → Rate pipeline and nomination fit check.",
        inputType: "engine",
      },
    ],
  },
];

export function getRubricForAction(action: JourneyAction) {
  if (!action.rubricKey) return null;
  return rubricAnchors[action.rubricKey] ?? null;
}
