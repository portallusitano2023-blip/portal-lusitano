// @ts-nocheck
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "irdip0-dq.myshopify.com";
const privateToken = process.env.SHOPIFY_PRIVATE_TOKEN; 

export async function shopifyFetch({ query, variables = {} }) {
  try {
    if (!privateToken) {
      console.error("ERRO: SHOPIFY_PRIVATE_TOKEN não configurado no Vercel.");
      return null;
    }

    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Usamos o cabeçalho correto para o token privado shpat_
        'Shopify-Storefront-Private-Token': privateToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store', 
    });

    const result = await response.json();

    if (result.errors) {
      console.error("Erro na API Shopify:", result.errors);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Falha na ligação ao Shopify:", error);
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
  
  // PROTEÇÃO: Se a API falhar, devolvemos uma lista vazia []
  // Isto impede que a página tente ler 'priceRange' de algo que não existe
  return res?.products?.edges?.map(edge => edge.node) || [];
}