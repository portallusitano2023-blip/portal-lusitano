// @ts-nocheck
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const privateToken = process.env.SHOPIFY_PRIVATE_TOKEN; 

export async function shopifyFetch({ query, variables = {} }) {
  try {
    if (!domain || !privateToken) {
      console.error("Configuração Headless em falta no Vercel.");
      return null;
    }

    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Cabeçalho correto para o Token Privado (shpat_...)
        'Shopify-Storefront-Private-Token': privateToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store', 
    });

    const result = await response.json();

    if (result.errors) {
      console.error("Erro Shopify API:", result.errors);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Falha na ligação Headless:", error);
    return null;
  }
}

export async function getProducts() {
  const query = `{
    products(first: 20) {
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
              }
            }
          }
        }
      }
    }
  }`;

  const res = await shopifyFetch({ query });
  
  // PROTEÇÃO: Retorna lista vazia [] se a API der erro 401
  // Evita o erro de 'undefined' na página da loja
  return res?.products?.edges?.map(edge => edge.node) || [];
}