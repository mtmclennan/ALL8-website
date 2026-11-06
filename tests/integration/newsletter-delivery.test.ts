import { afterEach, beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  upsert: vi.fn(),
  deal: vi.fn(),
  note: vi.fn(),
  task: vi.fn(),
  sheets: vi.fn(),
}));
vi.mock("@/lib/intake/verifyCaptcha", () => ({
  verifyCaptcha: vi.fn(async () => true),
}));
vi.mock("@/lib/intake/rateLimit", () => ({
  checkRateLimit: vi.fn(async () => {}),
}));
vi.mock("@/lib/integrations/hubspot/forms", () => ({
  submitToHubSpotForm: vi.fn(),
}));
vi.mock("@/lib/integrations/google/googleSheets", () => ({
  isDuplicateEntry: vi.fn(),
  appendLeadRow: mocks.sheets,
}));
vi.mock("@/lib/integrations/hubspot/crm", () => ({
  upsertContact: mocks.upsert,
  createDealForContact: mocks.deal,
  addNoteToContactAndDeal: mocks.note,
  createTaskForContactAndDeal: mocks.task,
}));

import { NEWSLETTER_CONFIRMATION_TIMEOUT_MS } from "../../lib/email/emailBrevo";
import { submitLeadPipeline } from "../../lib/leads/submitLead";

const subscriber = {
  name: "Newsletter subscriber",
  email: "private@example.invalid",
  leadType: "newsletter" as const,
  token: "test-token",
};
const submit = () => submitLeadPipeline(subscriber, "newsletter_signup");
beforeEach(() => {
  for (const mock of Object.values(mocks)) mock.mockReset();
  mocks.upsert.mockResolvedValue("existing-or-new-subscriber");
  vi.stubEnv("BREVO_API_KEY", "private-provider-key");
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

function capturedOnce() {
  expect(mocks.upsert).toHaveBeenCalledOnce();
  expect(fetch).toHaveBeenCalledOnce();
  expect(vi.mocked(fetch).mock.calls[0][1]?.signal).toBeInstanceOf(AbortSignal);
  for (const mock of [mocks.deal, mocks.note, mocks.task, mocks.sheets])
    expect(mock).not.toHaveBeenCalled();
}

it("waits for durable capture, then sends one successful confirmation and returns success", async () => {
  let capture: (id: string) => void = () => {};
  mocks.upsert.mockImplementationOnce(
    () =>
      new Promise<string>((resolve) => {
        capture = resolve;
      }),
  );
  vi.mocked(fetch).mockResolvedValueOnce(new Response("{}", { status: 201 }));
  const pending = submit();
  await vi.waitFor(() => expect(mocks.upsert).toHaveBeenCalledOnce());
  expect(fetch).not.toHaveBeenCalled();
  capture("saved-subscriber");
  await expect(pending).resolves.toMatchObject({
    ok: true,
    captured: true,
    message: "You're on the list.",
  });
  capturedOnce();
  expect(console.error).not.toHaveBeenCalled();
});

it("provider rejection after capture still returns success and logs no provider body or credentials", async () => {
  vi.mocked(fetch).mockResolvedValueOnce(
    new Response("private-provider-key private@example.invalid", {
      status: 500,
    }),
  );
  await expect(submit()).resolves.toMatchObject({ ok: true, captured: true });
  capturedOnce();
  expect(console.error).toHaveBeenCalledWith(
    "[Newsletter] Confirmation delivery failed",
    { reason: "provider_error" },
  );
  expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toMatch(
    /private-provider-key|private@example/,
  );
});

it("network failure after capture is sanitized and does not ask the user to retry a saved subscription", async () => {
  vi.mocked(fetch).mockRejectedValueOnce(
    new Error("private-provider-key private@example.invalid"),
  );
  await expect(submit()).resolves.toMatchObject({ ok: true, captured: true });
  capturedOnce();
  expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toMatch(
    /private-provider-key|private@example/,
  );
});

it.each([true, false])(
  "confirmation deadline aborts the actual request and bounds pending fetch (honors abort: %s)",
  async (honorsAbort) => {
    vi.useFakeTimers();
    let signal: AbortSignal | null | undefined;
    vi.mocked(fetch).mockImplementationOnce((_url, init) => {
      signal = init?.signal;
      return new Promise<Response>((_resolve, reject) => {
        if (honorsAbort)
          signal!.addEventListener("abort", () =>
            reject(new DOMException("private-provider-key", "AbortError")),
          );
      });
    });
    const pending = submit();
    await vi.advanceTimersByTimeAsync(0);
    expect(signal?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(NEWSLETTER_CONFIRMATION_TIMEOUT_MS);
    await expect(pending).resolves.toMatchObject({ ok: true, captured: true });
    expect(signal?.aborted).toBe(true);
    expect(console.error).toHaveBeenCalledWith(
      "[Newsletter] Confirmation delivery failed",
      { reason: "timeout" },
    );
    // Neither a timeout nor further elapsed time may retry capture or an ambiguous send.
    await vi.advanceTimersByTimeAsync(NEWSLETTER_CONFIRMATION_TIMEOUT_MS * 2);
    capturedOnce();
    expect(vi.getTimerCount()).toBe(0);
  },
);

it("failed subscriber capture remains an error and never attempts confirmation", async () => {
  mocks.upsert.mockRejectedValueOnce(new Error("Subscriber capture failed"));
  await expect(submit()).resolves.toMatchObject({ ok: false, captured: false });
  expect(mocks.upsert).toHaveBeenCalledOnce();
  expect(fetch).not.toHaveBeenCalled();
});
