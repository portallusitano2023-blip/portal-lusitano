// @ts-nocheck
const domain = "irdip0-dq.myshopify.com";
const storefrontAccessToken = "5566f8155086c19776145d6ff669019b";

export async function shopifyFetch({ query, variables = {} }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    // 👇 A MAGIA: Guarda em cache por 1 hora (3600 segundos)
    next: { revalidate: 3600 } 
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
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 1) { edges { node { url } } }
        }
      }
    }
  }`;

  const response = await shopifyFetch({ query });
  return response?.data?.products?.edges?.map(edge => edge.node) || [];
}