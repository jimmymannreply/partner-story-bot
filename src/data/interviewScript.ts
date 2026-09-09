export const interviewPrompts: Record<string, string> = {
  materials:
    "Before we start from scratch, do you already have customer quotes, logos, screenshots, a demo video, or a drafted case study? Upload anything you have.",
  aboutYou:
    "Tell us about your company and solution. What should we call your product in this story?",
  customer:
    "What is the customer's name, industry, size, and approval status for sharing this story?",
  before:
    "Before this engagement, what was the customer struggling with? What was slow, expensive, or broken?",
  solution:
    "What did you build, and which Microsoft technologies does it run on or integrate with?",
  impact:
    "What changed for the customer? If you can put a number on it—even a rough one—that is ideal.",
  whyMsft:
    "In your own words, why does Microsoft and your solution deliver more together than either would alone?",
  proof:
    "Do you have anything that backs this up—a report, dashboard screenshot, or deployment logs? Upload it now.",
  voice:
    "Who at the customer would be comfortable being quoted? What did they say in their own words?",
  tags:
    "Which solution area best fits: Azure infrastructure, data and AI, digital and app innovation, security, or modern work?",
  sentiment:
    "How would you describe the customer's enthusiasm about this win—in their own unpolished words?",
};

export const stageRailCopy: Record<
  string,
  { rationale: string; microsoftProvides: string; jamieHint: string }
> = {
  collect: {
    rationale:
      "Confirming context first stops the intake from becoming a generic checklist. We pre-fill what Microsoft already knows so you only correct gaps.",
    microsoftProvides:
      "Partner Center profile, Skilling Hub designations, and closed-won sales data—simulated in this demo.",
    jamieHint:
      "Start by signing in and confirming your company details. I'll walk you through each step.",
  },
  capture: {
    rationale:
      "Each question maps directly to the evidence scoring rubric. Specific answers here become higher scores later—vague answers become low scores.",
    microsoftProvides:
      "Guided prompts aligned to the FY26 Partner Evidence Story template and nomination form fields.",
    jamieHint:
      "Upload an existing case study at step one and we may skip ahead. Otherwise, answer each card in order.",
  },
  voice: {
    rationale:
      "Customer voice is the highest-weighted authenticity signal. A recorded verbatim quote scores higher than polished marketing copy.",
    microsoftProvides:
      "Simulated consent email and a secure recording link for your customer to submit video or voice.",
    jamieHint:
      "This step is optional but strongly recommended. Add customer emails and we'll send a consent link.",
  },
  review: {
    rationale:
      "Review everything before attestation. The Evidence Engine scores only after you submit—never during collection.",
    microsoftProvides:
      "Collect → Validate → Rate pipeline with nomination fit checks and simulated value/sentiment scoring.",
    jamieHint:
      "Check the recap, sign your attestation, then watch what happens behind the scenes.",
  },
};
