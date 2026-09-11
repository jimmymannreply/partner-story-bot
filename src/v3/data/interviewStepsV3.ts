import { interviewPrompts } from "@/data/interviewScript";

export interface InterviewStepV3 {
  id: string;
  label: string;
  prompt: string;
}

export const interviewStepsV3: InterviewStepV3[] = [
  { id: "contact", label: "Contact", prompt: "Who should we list as the primary partner contact for this story?" },
  { id: "about-you", label: "About You", prompt: interviewPrompts.aboutYou },
  { id: "customer", label: "Customer", prompt: interviewPrompts.customer },
  { id: "before", label: "Before", prompt: interviewPrompts.before },
  { id: "solution", label: "Solution", prompt: interviewPrompts.solution },
  { id: "impact", label: "Impact", prompt: interviewPrompts.impact },
  { id: "why-msft", label: "Why MSFT", prompt: interviewPrompts.whyMsft },
  { id: "proof", label: "Proof", prompt: interviewPrompts.proof },
  { id: "voice", label: "Voice", prompt: interviewPrompts.voice },
  { id: "tags", label: "Tags", prompt: interviewPrompts.tags },
  { id: "sentiment", label: "Sentiment", prompt: interviewPrompts.sentiment },
];
