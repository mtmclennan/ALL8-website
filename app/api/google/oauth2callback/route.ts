import { NextResponse } from "next/server";

/** See the disabled authorization endpoint for the credential policy. */
export function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
