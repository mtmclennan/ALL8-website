import type { Metadata } from "next";

import fs from "fs";
import path from "path";

import LegalPage from "./legalPage";

import { legalVars } from "@/config/legal.config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 86400; // 24 hours

const legalPath = path.join(process.cwd(), "data/legal.json");

interface LegalPageMeta {
  slug: string;
  title: string;
  version: string;
  jurisdiction: string;
}

export const metadata: Metadata = buildPageMetadata({
  title: `Legal • ${legalVars.companyName}`,
  description: `View ${legalVars.companyName} legal policies including Terms, Privacy, and Cookies.`,
  path: "/legal",
  openGraphTitle: `Legal Information | ${legalVars.companyName}`,
  openGraphDescription: `Official legal documents and policies from ${legalVars.companyName}.`,
  noindex: true,
});

export default async function LegalIndex() {
  const file = await fs.promises.readFile(legalPath, "utf8");
  const pages: LegalPageMeta[] = JSON.parse(file);

  return <LegalPage companyName={legalVars.companyName} pages={pages} />;
}
