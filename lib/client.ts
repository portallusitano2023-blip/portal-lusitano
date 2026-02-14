import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

const projectId = "ofrzpaxa";
const dataset = "production";
const apiVersion = "2024-01-01";

// Read client — CDN, sem token (para queries públicas)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Write client — sem CDN, com token (para mutações)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// Image URL builder
const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
