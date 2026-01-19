// @ts-nocheck
// 1. Ler as variáveis exatamente como estão no teu ficheiro .env
const domain = process.env.SHOPIFY_DOMAIN || "irdip0-dq.myshopify.com";
const publicToken = process.env.SHOPIFY_TOKEN; // Antes estava SHOPIFY_PRIVATE_TOKEN

export async function shopifyFetch({ query, variables = {} }) {
  try {
    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 2. CORREÇÃO: Usar o cabeçalho para tokens públicos (o que tu tens)
        'X-Shopify-Storefront-Access-Token': publicToken, 
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });
    
    const data = await response.json();
    
    // Pequeno log para te ajudar a ver se funcionou no terminal
    if (data.errors) {
      console.error("Erro Shopify:", data.errors);
    }
    
    return data;
  } catch (e) {
    console.error("Erro Fetch:", e);
    return null;
  }
}

export async function getProducts(tag = "") {
  const filter = tag ? `query: "tag:${tag}"` : "";

  const query = `{
    products(first: 20, ${filter}) {
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
  // Garante que devolve um array vazio se não houver produtos, para não dar erro
  return res?.data?.products?.edges?.map(edge => edge.node) || [];
}