import type { MetadataRoute } from "next";
import { TRABAJOS } from "@/lib/trabajos";
import { SITE_URL } from "@/lib/url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...TRABAJOS.map((t) => ({
      url: `${SITE_URL}/trabajos/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
