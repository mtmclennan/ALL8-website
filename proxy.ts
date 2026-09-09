import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

const LEGACY_HOSTS = new Set(["all8webworks.ca", "www.all8webworks.ca"]);

const PERSONAL_HOSTS = new Set(["mattmclennan.dev", "www.mattmclennan.dev"]);

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? request.nextUrl.hostname)
    .split(":")[0]
    .toLowerCase();

  if (PERSONAL_HOSTS.has(hostname)) {
    const destination = new URL("https://all8webworks.com/hire-matt");

    // All personal-domain paths lead to the profile; retain campaign queries.
    destination.search = request.nextUrl.search;

    return NextResponse.redirect(destination, 308);
  }

  if (!LEGACY_HOSTS.has(hostname)) {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();

  destination.protocol = "https:";
  destination.hostname = "all8webworks.com";
  destination.port = "";

  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: "/:path*",
};
