import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { type TestContext } from "node:test";

import type { CaptchaAction } from "../lib/intake/verifyCaptcha.ts";
import type { LeadActionState } from "../lib/leads/leadSubmission.ts";

let moduleId = 0;
async function browser(t: TestContext) {
  class Script extends EventTarget {
    id = "";
    src = "";
    async = false;
    defer = false;
    isConnected = false;
    remove() {
      this.isConnected = false;
    }
  }
  const scripts: Script[] = [];
  const calls: CaptchaAction[] = [];
  const windowMock: {
    grecaptcha?: {
      ready(callback: () => void): void;
      execute(key: string, options: { action: CaptchaAction }): Promise<string>;
    };
  } = {};
  const documentMock = {
    getElementById: (id: string) =>
      scripts.find((script) => script.isConnected && script.id === id) ?? null,
    createElement: () => new Script(),
    head: {
      appendChild(script: Script) {
        script.isConnected = true;
        scripts.push(script);
      },
    },
  };
  for (const [key, value] of Object.entries({
    window: windowMock,
    document: documentMock,
  })) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
  // Isolate the module's shared script cache without adding a production reset API.
  const client: typeof import("../lib/intake/clientCaptcha.ts") = await import(
    `../lib/intake/clientCaptcha.ts?test=${moduleId++}`
  );
  const install = (ready = (callback: () => void) => callback()) => {
    windowMock.grecaptcha = {
      ready,
      execute: async (key, { action }) => {
        assert.equal(key, "site-key");
        calls.push(action);
        return `fresh-token-${calls.length}`;
      },
    };
  };
  const dispatched: string[] = [];
  const submit = async (_previous: LeadActionState, data: FormData) => {
    dispatched.push(String(data.get("token")));
    return { ok: true };
  };
  return { ...client, scripts, calls, install, windowMock, dispatched, submit };
}

const flush = async () => {
  for (let i = 0; i < 12; i++) await Promise.resolve();
};

test("token generation waits for delayed script AND readiness; concurrent forms share one script", async (t) => {
  const b = await browser(t);
  const data = new FormData();
  data.set("token", "stale-token");
  const pending = b.withCaptcha(
    b.submit,
    "site-key",
    "lead_review",
  )({ ok: false }, data);
  const warmup = b.loadRecaptcha("site-key");
  assert.equal(b.scripts.length, 1);
  assert.equal(data.has("token"), false);
  assert.deepEqual(b.calls, []);
  assert.deepEqual(b.dispatched, []);

  let markReady: (() => void) | undefined;
  b.install((callback) => {
    markReady = callback;
  });
  b.scripts[0].dispatchEvent(new Event("load"));
  await flush();
  assert.deepEqual(b.calls, []);
  assert.deepEqual(b.dispatched, []);
  markReady!();
  assert.equal((await pending).ok, true);
  await warmup;
  assert.deepEqual(b.calls, ["lead_review"]);
  assert.deepEqual(b.dispatched, ["fresh-token-1"]);
  assert.equal(data.has("token"), false);
});

test("blocked script prevents dispatch, removes the failed script, and can retry", async (t) => {
  const b = await browser(t);
  const action = b.withCaptcha(b.submit, "site-key", "contact_form");
  const data = new FormData();
  data.set("token", "old-token");
  const pending = action({ ok: true }, data);
  b.scripts[0].dispatchEvent(new Event("error"));
  const failed = await pending;
  assert.equal(failed.ok, false);
  assert.equal(failed.captured, false);
  assert.match(failed.message!, /try sending again/);
  assert.equal(data.has("token"), false);
  assert.deepEqual(b.dispatched, []);
  assert.equal(b.scripts[0].isConnected, false);

  const retry = action(failed, data);
  assert.equal(b.scripts.length, 2);
  b.install();
  b.scripts[1].dispatchEvent(new Event("load"));
  assert.equal((await retry).ok, true);
  assert.deepEqual(b.dispatched, ["fresh-token-1"]);
});

test("missing site key prevents dispatch even if a CAPTCHA API exists", async (t) => {
  const b = await browser(t);
  b.install();
  const result = await b.withCaptcha(
    b.submit,
    undefined,
    "lead_review",
  )({ ok: false }, new FormData());
  assert.equal(result.ok, false);
  assert.deepEqual(b.dispatched, []);
});

test("a loaded script without the API and a throwing readiness callback fail closed", async (t) => {
  const b = await browser(t);
  const action = b.withCaptcha(b.submit, "site-key", "lead_review");
  const pending = action({ ok: false }, new FormData());
  b.scripts[0].dispatchEvent(new Event("load"));
  assert.equal((await pending).ok, false);

  const retry = action({ ok: false }, new FormData());
  b.install(() => {
    throw new Error("readiness failed");
  });
  b.scripts[1].dispatchEvent(new Event("load"));
  assert.equal((await retry).ok, false);
  assert.deepEqual(b.dispatched, []);
});

test("server rejection stays a rejection and a subsequent attempt gets a new token", async (t) => {
  const b = await browser(t);
  b.install();
  const rejected = {
    ok: false,
    message: "Verification failed. Please try again.",
  };
  const action = b.withCaptcha(
    async (previous, data) => {
      await b.submit(previous, data);
      return rejected;
    },
    "site-key",
    "contact_form",
  );
  const data = new FormData();
  assert.equal(await action({ ok: false }, data), rejected);
  assert.equal(data.has("token"), false);
  assert.equal(await action(rejected, data), rejected);
  assert.deepEqual(b.dispatched, ["fresh-token-1", "fresh-token-2"]);
});

test("a script that never loads times out and permits retry", async (t) => {
  const b = await browser(t);
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const action = b.withCaptcha(b.submit, "site-key", "lead_review");
  const pending = action({ ok: false }, new FormData());
  t.mock.timers.tick(15_000);
  const failed = await pending;
  assert.equal(failed.ok, false);
  assert.deepEqual(b.dispatched, []);
  b.install();
  const retry = action(failed, new FormData());
  b.scripts[1].dispatchEvent(new Event("load"));
  assert.equal((await retry).ok, true);
});

test("readiness timeout blocks execution; late readiness cannot dispatch", async (t) => {
  const b = await browser(t);
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let markReady: (() => void) | undefined;
  b.install((callback) => {
    markReady = callback;
  });
  const pending = b.withCaptcha(
    b.submit,
    "site-key",
    "lead_review",
  )({ ok: false }, new FormData());
  t.mock.timers.tick(15_000);
  assert.equal((await pending).ok, false);
  markReady!();
  await flush();
  assert.deepEqual(b.calls, []);
  assert.deepEqual(b.dispatched, []);
  // Reload even when a failed bootstrap left a grecaptcha stub behind.
  const retry = b.withCaptcha(
    b.submit,
    "site-key",
    "lead_review",
  )({ ok: false }, new FormData());
  assert.equal(b.scripts.length, 1);
  b.install();
  b.scripts[0].dispatchEvent(new Event("load"));
  assert.equal((await retry).ok, true);
});

test("execution rejects or returns an empty token without dispatch; retries use fresh tokens", async (t) => {
  const b = await browser(t);
  b.install();
  const action = b.withCaptcha(b.submit, "site-key", "newsletter_signup");
  const execute = b.windowMock.grecaptcha!.execute;
  const data = new FormData();
  for (const replacement of [
    () => {
      throw new Error("synchronous failure");
    },
    async () => {
      throw new Error("execution failed");
    },
    async () => "",
    async () => "   ",
  ]) {
    data.set("token", "stale-token");
    b.windowMock.grecaptcha!.execute = replacement;
    assert.equal((await action({ ok: false }, data)).ok, false);
    assert.equal(data.has("token"), false);
    assert.deepEqual(b.dispatched, []);
  }
  b.windowMock.grecaptcha!.execute = execute;
  await action({ ok: false }, data);
  await action({ ok: false }, data);
  assert.deepEqual(b.dispatched, ["fresh-token-1", "fresh-token-2"]);
});

test("execution timeout prevents dispatch even if a token arrives later", async (t) => {
  const b = await browser(t);
  t.mock.timers.enable({ apis: ["setTimeout"] });
  b.install();
  let finish: ((token: string) => void) | undefined;
  b.windowMock.grecaptcha!.execute = () =>
    new Promise((resolve) => {
      finish = resolve;
    });
  const pending = b.withCaptcha(
    b.submit,
    "site-key",
    "lead_review",
  )({ ok: false }, new FormData());
  await flush();
  t.mock.timers.tick(15_000);
  assert.equal((await pending).ok, false);
  finish!("late-token");
  await flush();
  assert.deepEqual(b.dispatched, []);
});

test("all three actual forms wire their expected action and keep accessible errors", async (t) => {
  const b = await browser(t);
  b.install();
  const cases = [
    ["app/(site)/_components/LeadModal.tsx", "lead_review"],
    ["app/(site)/contact/components/InlineLeadForm.tsx", "contact_form"],
    ["app/(site)/blog/_components/Newsletter.tsx", "newsletter_signup"],
  ] as const;
  for (const [path, action] of cases) {
    const source = await readFile(
      new URL(`../${path}`, import.meta.url),
      "utf8",
    );
    assert.match(source, new RegExp(`withCaptcha\\([\\s\\S]*?"${action}"`));
    assert.match(source, /role="alert"/);
    assert.match(source, /disabled=\{isPending\}/);
    assert.doesNotMatch(source, /grecaptcha\.ready|tokenRef/);
    const result = await b.withCaptcha(
      b.submit,
      "site-key",
      action,
    )({ ok: false }, new FormData());
    assert.equal(result.ok, true);
  }
  assert.deepEqual(
    b.calls,
    cases.map(([, action]) => action),
  );
});
