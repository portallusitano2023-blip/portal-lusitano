// lib/shopify.ts

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_TOKEN;

export async function shopifyFetch(query: string) {
  const URL = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token!,
      },
      body: JSON.stringify({ query }),
      cache: 'no-store', // Isto garante que vemos sempre os dados frescos
    });

    if (!response.ok) {
      throw new Error(`Erro Shopify: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Erro a ligar ao Shopify:", error);
    throw error;
  }
}

export async function getProducts() {
  const query = `
    {
      products(first: 6) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch(query);
  return response.products.edges;
}