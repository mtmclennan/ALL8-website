import { MetadataRoute } from "next";

import { isProductionDeployment, siteUrl } from "@/config/site.config";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeployment()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  const base = siteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/studio/", "/drafts/", "/static/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
