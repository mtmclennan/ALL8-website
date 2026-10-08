import type { LeadPayload } from "../lib/leads/types.ts";
import type { CaptchaAction } from "../lib/intake/verifyCaptcha.ts";

import assert from "node:assert/strict";
import test from "node:test";

import {
  handleLeadReviewSubmission,
  handleNewsletterSubmission,
  isHoneypotTripped,
} from "../lib/leads/leadSubmission.ts";

// A stand-in for submitLeadPipeline: records calls, never touches integrations.
function fakePipeline() {
  const calls: Array<{ data: LeadPayload; action: CaptchaAction }> = [];
  const pipeline = async (data: LeadPayload, action: CaptchaAction) => {
    calls.push({ data, action });

    return { ok: true, message: "captured" };
  };

  return { calls, pipeline };
}

const validLead = {
  name: "Taylor Owner",
  business: "Example Service Co",
  website: "example.com",
  email: "taylor@example.com",
  phone: "555-0100",
  challenge: "Missed calls",
  hp: "",
  token: "captcha-token",
  leadType: "Contact Page Form",
};

test("a filled honeypot returns silent success without running the pipeline", async () => {
  const { calls, pipeline } = fakePipeline();
  const result = await handleLeadReviewSubmission(
    { ...validLead, hp: "bot-trap" },
    pipeline,
  );

  assert.equal(result.ok, true);
  assert.equal(result.captured, false);
  assert.equal(calls.length, 0);
});

test("a filled honeypot short-circuits even when other fields are invalid", async () => {
  const { calls, pipeline } = fakePipeline();
  const result = await handleLeadReviewSubmission(
    { name: "", email: "not-an-email", hp: "x" },
    pipeline,
  );

  assert.equal(result.ok, true);
  assert.equal(result.captured, false);
  assert.equal(result.fieldErrors, undefined);
  assert.equal(calls.length, 0);
});

test("whitespace-only honeypot values are treated as empty", () => {
  assert.equal(isHoneypotTripped({ hp: "   " }), false);
  assert.equal(isHoneypotTripped({}), false);
  assert.equal(isHoneypotTripped({ hp: "filled" }), true);
});

test("invalid submissions are rejected with field errors and never reach the pipeline", async () => {
  const { calls, pipeline } = fakePipeline();
  const result = await handleLeadReviewSubmission(
    { ...validLead, name: "", business: "", email: "nope" },
    pipeline,
  );

  assert.equal(result.ok, false);
  assert.deepEqual(Object.keys(result.fieldErrors ?? {}).sort(), [
    "business",
    "email",
    "name",
  ]);
  assert.equal(calls.length, 0);
});

test("a valid submission reaches the pipeline once with the mapped payload", async () => {
  const { calls, pipeline } = fakePipeline();
  const result = await handleLeadReviewSubmission(validLead, pipeline);

  assert.equal(result.ok, true);
  assert.equal(result.captured, undefined);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].action, "contact_form");
  assert.equal(calls[0].data.leadType, "lead-review");
  assert.equal(calls[0].data.company, "Example Service Co");
  assert.equal(calls[0].data.notes, "Phone: 555-0100");
  assert.equal(calls[0].data.token, "captcha-token");
});

test("modal submissions use the lead_review captcha action", async () => {
  const { calls, pipeline } = fakePipeline();

  await handleLeadReviewSubmission(
    { ...validLead, leadType: "Lead Leak Review Modal" },
    pipeline,
  );
  assert.equal(calls[0].action, "lead_review");
});

test("pipeline failures are returned unchanged, not converted to success", async () => {
  const result = await handleLeadReviewSubmission(validLead, async () => ({
    ok: false,
    message: "We couldn't save your request just now.",
  }));

  assert.equal(result.ok, false);
});

test("newsletter honeypot and validation follow the same rules", async () => {
  const { calls, pipeline } = fakePipeline();
  const trapped = await handleNewsletterSubmission(
    { email: "a@example.com", hp: "bot" },
    pipeline,
  );
  const invalid = await handleNewsletterSubmission({ email: "nope" }, pipeline);
  const valid = await handleNewsletterSubmission(
    { email: "a@example.com", hp: "" },
    pipeline,
  );

  assert.equal(trapped.captured, false);
  assert.equal(invalid.ok, false);
  assert.equal(valid.ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].action, "newsletter_signup");
});
