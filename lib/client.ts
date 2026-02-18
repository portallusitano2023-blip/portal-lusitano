import { createClient } from "next-sanity";

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
