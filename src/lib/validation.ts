import { designationCatalog } from "@/data/mockPartnerData";

export function validateDesignation(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Enter a designation name.";
  if (trimmed.length < 8) return "Designation name is too short.";
  const match = designationCatalog.find(
    (d) => d.toLowerCase() === trimmed.toLowerCase()
  );
  if (!match) {
    return `Not found in the Partner Center catalog. Choose from: ${designationCatalog.slice(0, 3).join(", ")}, …`;
  }
  return null;
}

export function validateCustomEngagement(entry: string): string | null {
  const trimmed = entry.trim();
  if (!trimmed) return "Describe your engagement or sale.";
  if (trimmed.length < 12) {
    return "Please include the engagement name and customer (at least 12 characters).";
  }
  const hasCustomerHint =
    trimmed.includes("—") ||
    trimmed.includes(" - ") ||
    /\bfor\b/i.test(trimmed) ||
    /\bwith\b/i.test(trimmed);
  if (!hasCustomerHint) {
    return 'Include the customer name, e.g. "Azure AI migration — Fabrikam Industries".';
  }
  return null;
}
