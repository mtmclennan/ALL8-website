import { afterEach, beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  captcha: vi.fn(), limit: vi.fn(), form: vi.fn(), duplicate: vi.fn(),
  sheets: vi.fn(), upsert: vi.fn(), deal: vi.fn(), note: vi.fn(), task: vi.fn(),
}));
vi.mock("@/lib/intake/verifyCaptcha", () => ({ verifyCaptcha: mocks.captcha }));
vi.mock("@/lib/intake/rateLimit", () => ({ checkRateLimit: mocks.limit }));
vi.mock("@/lib/integrations/hubspot/forms", () => ({ submitToHubSpotForm: mocks.form }));
vi.mock("@/lib/integrations/google/googleSheets", () => ({ isDuplicateEntry: mocks.duplicate, appendLeadRow: mocks.sheets }));
vi.mock("@/lib/integrations/hubspot/crm", () => ({ upsertContact: mocks.upsert, createDealForContact: mocks.deal, addNoteToContactAndDeal: mocks.note, createTaskForContactAndDeal: mocks.task }));

import { submitLeadReview } from "../../app/actions/submit-lead-review";

beforeEach(() => {
  for (const mock of Object.values(mocks)) mock.mockReset().mockResolvedValue(undefined);
  mocks.captcha.mockResolvedValue(true);
  mocks.duplicate.mockResolvedValue(false);
  mocks.upsert.mockResolvedValue("test-contact");
  mocks.deal.mockResolvedValue("test-deal");
  vi.stubEnv("BREVO_API_KEY", "test-only");
  vi.stubEnv("CONTACT_TO", "owner@example.invalid");
  vi.mocked(fetch).mockImplementation(async () => new Response("{}", { status: 201 }));
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => vi.unstubAllEnvs());

function payload(leadType: string, hp = "") {
  const data = new FormData();
  for (const [key, value] of Object.entries({ name: "Test Owner", business: "Example Service", email: "test@example.invalid", token: "test-token", leadType, hp })) data.set(key, value);
  return data;
}

it.each(["Lead Leak Review", "Contact Page Form"])("%s reaches Brevo, HubSpot, Sheets and CRM through the real action and pipeline", async (leadType) => {
  expect(await submitLeadReview({ ok: false }, payload(leadType))).toMatchObject({ ok: true, captured: true });
  expect(fetch).toHaveBeenCalled(); // All fetches are stubbed; no vendor request.
  expect(String(vi.mocked(fetch).mock.calls[0][0])).toContain("api.brevo.com");
  await vi.waitFor(() => {
    for (const step of [mocks.form, mocks.sheets, mocks.upsert, mocks.deal, mocks.note, mocks.task]) expect(step).toHaveBeenCalledOnce();
  });
  expect(mocks.limit).toHaveBeenCalledOnce();
  expect(mocks.captcha).toHaveBeenCalledWith("test-token", leadType === "Contact Page Form" ? "contact_form" : "lead_review");
});

it("filled trap prevents every provider call through the real action and pipeline", async () => {
  expect(await submitLeadReview({ ok: false }, payload("Lead Leak Review", "bot"))).toMatchObject({ ok: true, captured: false });
  expect(fetch).not.toHaveBeenCalled();
  for (const mock of Object.values(mocks)) expect(mock).not.toHaveBeenCalled();
});

it("Brevo owner rejection returns a real action error and never starts secondary capture", async () => {
  vi.mocked(fetch).mockResolvedValueOnce(new Response("private-provider-response", { status: 503 }));
  expect(await submitLeadReview({ ok: false }, payload("Lead Leak Review"))).toMatchObject({ ok: false, captured: false });
  expect(fetch).toHaveBeenCalledOnce();
  for (const step of [mocks.form, mocks.sheets, mocks.upsert, mocks.deal, mocks.note, mocks.task]) expect(step).not.toHaveBeenCalled();
  expect(console.error).toHaveBeenCalledWith("[LeadSubmission]", { event: "owner_notification_failed", reason: "provider_http_error", status: 503 });
  expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toMatch(/private-provider-response|test@example|test-token/);
});
