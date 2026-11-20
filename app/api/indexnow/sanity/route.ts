import { createHash } from "node:crypto";

import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { dataset, projectId } from "@/app/studio/sanity/env";
import { isProductionDeployment } from "@/config/site-origin";
import { blogEvent, prepareBlogNotification } from "@/lib/indexnow/blogEvent";
import {
  indexNowEnabled,
  readIndexNowConfig,
  submitIndexNow,
} from "@/lib/indexnow/client";
import { claimDelivery } from "@/lib/indexnow/delivery";

export const runtime = "nodejs";

const reply = (status: number, outcome: string) =>
  Response.json(
    { outcome },
    { status, headers: { "cache-control": "no-store" } },
  );

export async function POST(request: NextRequest) {
  if (!isProductionDeployment() || !indexNowEnabled())
    return reply(404, "disabled");
  const secret = process.env.SANITY_INDEXNOW_WEBHOOK_SECRET?.trim();

  if (!secret || secret.length < 32 || secret === process.env.INDEXNOW_KEY) {
    return reply(503, "misconfigured");
  }
  if (Number(request.headers.get("content-length")) > 16_384)
    return reply(413, "too large");
  if (!request.headers.has("sanity-webhook-signature"))
    return reply(401, "unauthorized");

  let parsed: Awaited<ReturnType<typeof parseBody<unknown>>>;

  try {
    parsed = await parseBody<unknown>(request, secret, false);
  } catch {
    return reply(400, "invalid request");
  }
  if (parsed.isValidSignature !== true) return reply(401, "unauthorized");

  const result = blogEvent.safeParse(parsed.body);

  if (!result.success) return reply(400, "invalid event");
  const { data: event } = result;

  if (event.projectId !== projectId || event.dataset !== dataset)
    return reply(403, "wrong dataset");
  if (!event.meaningful) return reply(200, "ignored");

  const digest = createHash("sha256")
    .update(
      JSON.stringify([
        projectId,
        dataset,
        (event.after ?? event.before)?.id,
        event.before?.revision,
        event.after?.revision,
      ]),
    )
    .digest("hex");
  let release: (() => Promise<void>) | undefined;
  let accepted = false;

  try {
    readIndexNowConfig();
    const delivery = await claimDelivery(digest);

    if (delivery.state === "duplicate") return reply(200, "duplicate");
    if (delivery.state === "busy") return reply(503, "try again");
    release = () => delivery.finish(false);
    const urls = await prepareBlogNotification(event, revalidatePath);

    if (urls.length) {
      await submitIndexNow(urls);
      accepted = true;
    }
    await delivery.finish(true);

    return reply(200, urls.length ? "submitted" : "ignored");
  } catch {
    if (!accepted) await release?.().catch(() => {});
    console.warn("[IndexNow] Sanity delivery needs retry");
    return reply(503, "try again");
  }
}
