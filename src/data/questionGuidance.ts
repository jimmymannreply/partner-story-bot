export const questionGuidance: Record<
  string,
  { lookingFor: string; tip: string }
> = {
  materials: {
    lookingFor:
      "Existing assets that reduce how much you need to answer from scratch—case studies, quotes, logos, screenshots, or video.",
    tip: "Uploading a case study here can pre-fill up to 6 interview sections automatically.",
  },
  "about-you": {
    lookingFor:
      "Your company identity, solution name used consistently, partner type, designations, and AppSource/Marketplace link.",
    tip: "Pre-filled from Partner Center and Skilling Hub when you sign in.",
  },
  customer: {
    lookingFor:
      "Customer name (or anonymized descriptor), industry, size, and their approval status for public use.",
    tip: "A 'not approved' status does not block collection—it limits external publishing until it changes.",
  },
  before: {
    lookingFor:
      "A specific daily pain or baseline—not vague statements like 'things were slow.'",
    tip: "Strong answers describe what was happening day-to-day before your solution.",
  },
  solution: {
    lookingFor:
      "Named Microsoft technologies (Azure OpenAI, Cosmos DB, Copilot)—not generic 'the cloud.'",
    tip: "Pre-filled from your selected engagement or MCI/sales record when available.",
  },
  impact: {
    lookingFor:
      "Quantified before/after outcomes—even rough estimates score higher than vague claims.",
    tip: "This is the highest-weighted rubric dimension (25%).",
  },
  "why-msft": {
    lookingFor:
      "Your own words on why the joint Microsoft + partner value is greater than either alone.",
    tip: "Feeds the narrative compiler directly—not a scored rubric dimension.",
  },
  proof: {
    lookingFor:
      "An uploaded artifact that substantiates your headline number—report, dashboard, signed order.",
    tip: "Also weighted at 25%. Unverified claims can be added later before publishing.",
  },
  voice: {
    lookingFor:
      "Named individual with title, plus an unpolished quote—not marketing copy.",
    tip: "Recorded customer voice scores higher than typed quotes.",
  },
  tags: {
    lookingFor:
      "Solution area, Microsoft products, industry, and segment tags for downstream matching.",
    tip: "Fully tagged submissions route faster to the right nomination channels.",
  },
  sentiment: {
    lookingFor:
      "Natural, enthusiastic customer tone—not coached corporate language.",
    tip: "Sentiment is scored separately from value so genuine warmth is not diluted.",
  },
  "sign-in": {
    lookingFor: "Partner Center authentication to pre-fill profile and designations.",
    tip: "You can continue as a guest and fill everything manually—submit at attest and sign.",
  },
  "confirm-profile": {
    lookingFor: "Confirmation that auto-filled company details are correct.",
    tip: "Correct any errors before continuing—this data seeds multiple interview sections.",
  },
  "confirm-designations": {
    lookingFor: "Validation of your Solutions Partner designations from Skilling Hub.",
    tip: "Add or correct designations that are missing from the catalog.",
  },
  "select-win": {
    lookingFor:
      "The engagement, MCI record, or closed-won sale this story is about.",
    tip: "Selecting a record pre-fills customer, solution, impact, and tags sections.",
  },
  "accept-consent": {
    lookingFor: "Affidavit acceptance and customer approval status for sharing.",
    tip: "Four approval states match Microsoft's nomination form.",
  },
  "invite-customer": {
    lookingFor: "Valid customer email addresses to receive a consent and recording link.",
    tip: "Opens your email client with a pre-drafted consent message.",
  },
  "customer-record": {
    lookingFor: "Customer video or voice recording with explicit consent.",
    tip: "Share the consent link so the customer can record from their own device.",
  },
  "customer-received": {
    lookingFor: "Confirmation that the customer's verbatim submission was received.",
    tip: "Video or voice recordings score highest on quote authenticity.",
  },
  recap: {
    lookingFor: "A complete review of all sections with gaps flagged before attestation.",
    tip: "You can go back to any stage to fill missing answers.",
  },
  attest: {
    lookingFor:
      "Your attestation checkbox, typed full name, and drawn signature to submit.",
    tip: "Guest users submit here—no Partner Center sign-in required.",
  },
  "submit-engine": {
    lookingFor: "Understanding of what happens after submission—Collect, Validate, Rate.",
    tip: "Scoring runs only after you submit, never during collection.",
  },
};
