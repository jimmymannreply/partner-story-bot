export interface RubricAnchor {
  dimension: string;
  score1: string;
  score5: string;
}

export const rubricAnchors: Record<string, RubricAnchor> = {
  proofLinkage: {
    dimension: "Proof linkage",
    score1: "Claim has no supporting artifact anywhere in the submission.",
    score5:
      "Claim is directly backed by an uploaded proof-of-execution artifact that substantiates the specific number.",
  },
  metadataCompleteness: {
    dimension: "Metadata completeness",
    score1: "Missing industry, segment, and product tags.",
    score5: "Fully tagged for downstream matching and reuse.",
  },
  sourceCredibility: {
    dimension: "Source credibility",
    score1: "Anonymous, no name, title, or role given.",
    score5:
      "Named individual with a title and clear authority over the claim—a decision maker or hands-on user.",
  },
  problemBeforeState: {
    dimension: "Problem and before state",
    score1: "No baseline or problem described.",
    score5: "Clear, specific before state that gives the outcome real contrast.",
  },
  outcomeSpecificity: {
    dimension: "Outcome specificity",
    score1: 'Vague claim with no number, e.g. "things got better."',
    score5:
      'Quantified outcome with a clear before and after, e.g. "cut deployment from 14 weeks to 4."',
  },
  quoteAuthenticity: {
    dimension: "Quote authenticity",
    score1: "Reads like marketing copy attributed to the customer.",
    score5:
      "Direct quote traceable to the customer's own recorded voice or video.",
  },
  msTechnologyFit: {
    dimension: "Microsoft technology fit",
    score1: 'Generic reference to "the cloud" or "Microsoft tools."',
    score5:
      "Named Azure, AI, Copilot, or agent services with clear integration details.",
  },
  sentiment: {
    dimension: "Sentiment",
    score1: "Neutral, frustrated, or coached corporate language.",
    score5: "Sounds like an unscripted, natural, enthusiastic customer voice.",
  },
};
