// @ts-nocheck
const domain = "irdip0-dq.myshopify.com";
const storefrontAccessToken = "5566f8155086c19776145d6ff669019b";

export async function shopifyFetch({ query, variables = {} }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Esta é a chave pública que mostraste no print
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  return response.json();
}

export async function getProducts() {
  const query = `{
    products(first: 10) {
      edges {
        node {
          id
          title
          handle
          availableForSale
          description
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
  }`;

  const response = await shopifyFetch({ query });
  // Se der erro, devolve array vazio para não partir o site
  return response?.data?.products?.edges?.map(edge => edge.node) || [];
}