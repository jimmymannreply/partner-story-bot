const CONSENT_BASE =
  typeof window !== "undefined"
    ? `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, "")}/consent`
    : "/consent";

export function buildConsentMailto(
  customerEmail: string,
  partnerName: string,
  engagementName: string
): string {
  const consentLink = `${CONSENT_BASE}?email=${encodeURIComponent(customerEmail)}&engagement=${encodeURIComponent(engagementName)}`;
  const subject = encodeURIComponent(
    "Share your experience — quick video or voice recording"
  );
  const body = encodeURIComponent(
    `Hello,\n\n${partnerName} is submitting a partner success story about your recent engagement and would like to include your voice.\n\nPlease record a short video or voice testimonial (2–3 minutes) using this secure link:\n${consentLink}\n\nBy recording, you consent to Microsoft and ${partnerName} using your quote in partner marketing materials.\n\nThank you,\n${partnerName}`
  );
  return `mailto:${customerEmail}?subject=${subject}&body=${body}`;
}

export function openConsentEmail(
  customerEmail: string,
  partnerName: string,
  engagementName: string
): boolean {
  const url = buildConsentMailto(customerEmail, partnerName, engagementName);
  window.location.href = url;
  return true;
}
