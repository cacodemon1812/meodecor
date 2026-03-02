import type { MetadataRoute } from "next";
import { EVENTS_DATA } from "@/services/mockApi";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://meodecor.info";

export default function sitemap(): MetadataRoute.Sitemap {
  const eventPages: MetadataRoute.Sitemap = EVENTS_DATA.map((event) => ({
    url: `${SITE_URL}/events/${event.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...eventPages,
  ];
}
