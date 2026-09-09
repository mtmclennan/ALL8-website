import { NextResponse } from "next/server";

/**
 * OAuth credential provisioning is an administrative deployment task, not a
 * public application feature. Production uses environment-provisioned service
 * account credentials or an explicitly mounted OAuth token.
 */
export function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
