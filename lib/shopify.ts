// @ts-nocheck
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "irdip0-dq.myshopify.com";
const privateToken = process.env.SHOPIFY_PRIVATE_TOKEN; 

export async function shopifyFetch({ query, variables = {} }) {
  try {
    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Shopify-Storefront-Private-Token': privateToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });
    return await response.json();
  } catch (e) {
    return null;
  }
}

export async function getProducts(tag = "") {
  // Construímos o filtro de tag para o Shopify
  const filter = tag ? `query: "tag:${tag}"` : "";
  
  const query = `{
    products(first: 20, ${filter}) {
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
  return res?.data?.products?.edges?.map(edge => edge.node) || [];
}