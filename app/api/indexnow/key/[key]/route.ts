import { indexNowKeyResponse } from "@/lib/indexnow/client";

export const dynamic = "force-dynamic";

export async function GET(
  _: Request,
  context: { params: Promise<{ key: string }> },
) {
  return indexNowKeyResponse((await context.params).key);
}
