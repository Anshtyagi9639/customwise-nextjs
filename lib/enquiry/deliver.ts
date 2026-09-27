import "server-only";
import type { EnquiryInput } from "@/lib/validation/enquiry";
import { enquiryServices } from "@/lib/validation/enquiry";
import { postToWebhook, type DeliveryOutcome } from "./webhook";

export type { DeliveryOutcome };

/** Enquiries are POSTed as JSON to ENQUIRY_WEBHOOK_URL. */
export async function deliverEnquiry(enquiry: EnquiryInput): Promise<DeliveryOutcome> {
  const outcome = await postToWebhook(process.env.ENQUIRY_WEBHOOK_URL, process.env.ENQUIRY_WEBHOOK_SECRET, {
    type: "website_enquiry",
    receivedAt: new Date().toISOString(),
    to: process.env.CONTACT_EMAIL ?? "info@customswise.ie",
    enquiry: {
      name: enquiry.name,
      company: enquiry.company || null,
      email: enquiry.email,
      phone: enquiry.phone || null,
      service: enquiry.service,
      serviceLabel: enquiryServices.find((s) => s.value === enquiry.service)?.label ?? enquiry.service,
      message: enquiry.message,
    },
  });
  if (!outcome.delivered && outcome.reason === "not-configured") {
    console.warn("[enquiry] ENQUIRY_WEBHOOK_URL is not configured; the enquiry was not sent or stored.");
  }
  return outcome;
}
