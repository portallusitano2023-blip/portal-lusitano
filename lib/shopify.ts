// @ts-nocheck
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "irdip0-dq.myshopify.com";
const publicToken = "5566f8155086c19776145d6ff669019b";

export async function shopifyFetch({ query, variables = {} }) {
  try {
    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': publicToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Erro Shopify:", error);
    return null;
  }
}

// FUNÇÃO ATUALIZADA: Agora aceita uma TAG para filtrar
export async function getProducts(tag = "") {
  const query = `{
    products(first: 20, query: "${tag ? `tag:${tag}` : ""}") {
      edges {
        node {
          id
          title
          handle
          priceRange { minVariantPrice { amount } }
          images(first: 1) { edges { node { url } } }
        }
      }
    }
  }`;

  const res = await shopifyFetch({ query });
  return res?.products?.edges?.map(edge => edge.node) || [];
}