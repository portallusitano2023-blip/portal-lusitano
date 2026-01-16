// @ts-nocheck
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "irdip0-dq.myshopify.com";
const privateToken = process.env.SHOPIFY_PRIVATE_TOKEN;

export async function shopifyFetch({ query, variables = {} }) {
  try {
    if (!privateToken) {
      console.error("ERRO: SHOPIFY_PRIVATE_TOKEN não encontrado no Vercel.");
      return null;
    }

    const endpoint = `https://${domain}/api/2024-01/graphql.json`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Tentamos o cabeçalho oficial para tokens privados (shpat_...)
        'Shopify-Storefront-Private-Token': privateToken,
        // Fallback: alguns ambientes exigem o cabeçalho padrão mesmo com token privado
        'X-Shopify-Storefront-Access-Token': privateToken,
      },
      body: JSON.stringify({ query, variables }),
      // Importante para evitar erros de sessão em cache
      cache: 'no-store', 
    });

    const result = await response.json();

    if (result.errors) {
      console.error("Erro na API Shopify:", JSON.stringify(result.errors));
      return null;
    }

    // Se o Shopify devolver o erro de sessão no corpo da resposta
    if (result.errorCode === "SIO-401-ANF") {
      console.error("ERRO DE SESSÃO: O Shopify rejeitou o token ou o domínio.");
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Falha crítica na ligação Headless:", error.message);
    return null;
  }
}

// Funções de busca com proteção contra 'undefined'
export async function getProducts() {
  const query = `{
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          priceRange { minVariantPrice { amount } }
        }
      }
    }
  }`;
  const data = await shopifyFetch({ query });
  return data?.products?.edges?.map(edge => edge.node) || [];
}

export async function getBlogPosts() {
  const query = `{
    articles(first: 10) {
      edges {
        node {
          id
          title
          handle
          publishedAt
        }
      }
    }
  }`;
  const data = await shopifyFetch({ query });
  return data?.articles?.edges?.map(edge => edge.node) || [];
}