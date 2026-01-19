// @ts-nocheck

// 👇 1. ESTOU A USAR OS DADOS DIRETOS DO TEU PRINT
const domain = "irdip0-dq.myshopify.com";
const publicToken = "5566f8155086c19776145d6ff669019b";

export async function shopifyFetch({ query, variables = {} }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': publicToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store', // Garante que não guarda cache velha
    });

    const data = await response.json();

    // 👇 LOG DE DEBUG: Vai aparecer no teu terminal (onde corres o npm run dev)
    console.log("--- DEBUG SHOPIFY ---");
    if (data.errors) {
      console.error("ERRO NA API:", JSON.stringify(data.errors, null, 2));
    } else {
      console.log("Produtos encontrados:", data?.data?.products?.edges?.length || 0);
    }
    console.log("---------------------");

    return data;
  } catch (e) {
    console.error("ERRO CRÍTICO FETCH:", e);
    return null;
  }
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

  const res = await shopifyFetch({ query });
  return res?.data?.products?.edges?.map(edge => edge.node) || [];
}