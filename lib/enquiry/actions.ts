"use server";

import { enquirySchema, type EnquiryInput, type EnquiryResult } from "@/lib/validation/enquiry";
import { deliverEnquiry } from "./deliver";
import { isRateLimited } from "./rate-limit";
import { clientIp } from "./webhook";
import { site } from "@/lib/site";

const contactFallback = `email ${site.email} or call ${site.phone.display}`;

export async function submitEnquiry(input: unknown): Promise<EnquiryResult> {
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof EnquiryInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof EnquiryInput | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "Some details need attention.", fieldErrors };
  }

  // Honeypot filled: report success so bots learn nothing, but deliver nothing.
  if (parsed.data.website) return { ok: true };

  if (isRateLimited(`enquiry:${await clientIp()}`)) {
    return { ok: false, message: `Too many enquiries from this connection. Wait a few minutes, or ${contactFallback}.` };
  }

  const outcome = await deliverEnquiry(parsed.data);
  if (!outcome.delivered) {
    return {
      ok: false,
      message:
        outcome.reason === "not-configured"
          ? `Online enquiries aren't connected yet, so this form can't send your message. Please ${contactFallback}.`
          : `Your enquiry couldn't be sent just now. Please ${contactFallback}.`,
    };
  }
  return { ok: true };
}
