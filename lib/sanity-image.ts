import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

// Lightweight image URL builder — uses only @sanity/image-url (no full Sanity client)
const builder = createImageUrlBuilder({
  projectId: "ofrzpaxa",
  dataset: "production",
});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
