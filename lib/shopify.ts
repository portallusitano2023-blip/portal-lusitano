// @ts-nocheck
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_TOKEN;

export async function shopifyFetch({ query, variables = {} }) {
  try {
    if (!domain || !accessToken) {
      console.error("Erro: Variáveis do Shopify não configuradas.");
      return null;
    }

    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("Erro na API do Shopify:", result.errors);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Falha na ligação ao Shopify:", error);
    return null;
  }
}

// Exemplo para os produtos (ajusta conforme as tu.as necessidades)
export async function getProducts() {
  const query = `{ products(first: 10) { edges { node { id title handle } } } }`;
  const data = await shopifyFetch({ query });
  return data?.products?.edges?.map(edge => edge.node) || [];
}