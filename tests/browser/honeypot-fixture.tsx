import { createRoot } from "react-dom/client";

import LeadModal from "../../app/(site)/_components/LeadModal";
import InlineLeadForm from "../../app/(site)/contact/components/InlineLeadForm";
import Newsletter from "../../app/(site)/blog/_components/Newsletter";

// Bundled only by honeypot.test.mjs. Actions are replaced at build time; no
// Next server, credentials, CAPTCHA provider or external integration is used.
declare global {
  interface Window {
    submissions: Record<string, FormDataEntryValue>[];
  }
}

window.submissions = [];
Object.assign(window, {
  grecaptcha: {
    ready: (callback: () => void) => callback(),
    execute: async () => "browser-test-token",
  },
  dataLayer: [],
});
const wait = async (condition: () => boolean) => {
  for (let i = 0; i < 100; i++) {
    if (condition()) return;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error("Timed out waiting for browser state");
};
const check = (value: boolean, message: string) => {
  if (!value) throw new Error(message);
};

async function run() {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  for (const kind of ["modal", "contact", "newsletter"]) {
    for (const bot of [false, true]) {
      root.render(
        <div key={`${kind}-${bot}`}>
          {kind === "modal" ? <LeadModal open onClose={() => {}} /> :
            kind === "contact" ? <InlineLeadForm /> : <Newsletter />}
        </div>,
      );
      await wait(() => !!host.querySelector("form"));
      // Let React install effects and clear the previous render.
      await new Promise((resolve) => setTimeout(resolve, 150));
      const form = host.querySelector("form")!;
      const trap = form.querySelector<HTMLInputElement>('input[name="hp"]')!;
      check(getComputedStyle(trap.parentElement!).display === "none", "trap rendered");
      check(trap.getClientRects().length === 0, "trap has layout");
      check(trap.tabIndex === -1 && trap.getAttribute("aria-hidden") === "true", "trap accessibility");
      trap.focus();
      check(document.activeElement !== trap, "trap can receive focus");
      check(trap.autocomplete === "off", "trap allows autocomplete");
      for (const input of form.querySelectorAll<HTMLInputElement>("input")) {
        if (input.name === "name") input.value = "Browser Owner";
        if (input.name === "business") input.value = "Example Service";
        if (input.name === "email") input.value = "browser@example.invalid";
      }
      trap.value = bot ? "bot-filled" : "";
      check(new FormData(form).get("hp") === trap.value, "trap omitted from FormData");
      const previous = window.submissions.length;
      if (!bot) {
        // Simulate a script changing the DOM after the browser has constructed
        // the submission snapshot. The old hpRef override copied this value
        // back into an otherwise legitimate FormData payload.
        form.addEventListener("formdata", () => { trap.value = "late-script-write"; }, { once: true });
      }
      form.requestSubmit();
      await wait(() => window.submissions.length === previous + 1);
      check(window.submissions[previous].hp === (bot ? "bot-filled" : ""), "trap value changed");
      check(window.submissions[previous].token === "browser-test-token", "missing CAPTCHA token");
      if (bot) {
        await wait(() => !!host.querySelector('[role="alert"]'));
        check(!/Request received|First note lands/.test(host.textContent!), "false success shown");
      } else {
        await wait(() => /Request received|First note lands/.test(host.textContent!));
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
      const conversions = (window.dataLayer ?? []).filter((event: { event?: string }) => event.event === "generate_lead");
      check(conversions.length === (!bot && kind !== "newsletter" ? 1 : 0), "incorrect conversion count");
      window.dataLayer = [];
      root.render(null);
      await wait(() => !host.querySelector("form"));
    }
  }
  root.unmount();
  document.body.dataset.result = "PASS: 6 real-browser form scenarios";
}
void run().catch((error) => { document.body.dataset.result = `FAIL: ${String(error)}`; });
