// @ts-nocheck
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_TOKEN;

async function shopifyFetch({ query, variables = {} }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });
    return await response.json();
  } catch (e) {
    console.error("Erro na API Shopify:", e);
    return { data: null };
  }
}

// 1. LISTAGEM DE PRODUTOS
export async function getProducts() {
  const query = `query { products(first: 20) { edges { node { id handle title images(first: 1) { edges { node { url } } } priceRange { minVariantPrice { amount } } } } } }`;
  const res = await shopifyFetch({ query });
  return res.data?.products.edges.map(edge => ({ ...edge.node, images: edge.node.images.edges.map(img => img.node) })) || [];
}

// 2. DETALHE DO PRODUTO (RESOLVE O HANDLE)
export async function getProduct(handle) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        descriptionHtml
        images(first: 5) { edges { node { url } } }
        variants(first: 20) {
          edges {
            node {
              id
              title
              price { amount }
              image { url }
            }
          }
        }
      }
    }
  `;
  const res = await shopifyFetch({ query, variables: { handle } });
  return res.data?.productByHandle;
}

// 3. CRIAÇÃO DE CARRINHO
export async function createCart() {
  const query = `mutation { cartCreate { cart { id checkoutUrl totalQuantity } } }`;
  const res = await shopifyFetch({ query });
  return res.data?.cartCreate?.cart;
}

// 4. CONSULTA DE CARRINHO (ESTA É A QUE ESTAVA A DAR ERRO)
export async function getCart(cartId) {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount }
                  product { title images(first: 1) { edges { node { url } } } }
                }
              }
            }
          }
        }
      }
    }
  `;
  const res = await shopifyFetch({ query, variables: { cartId } });
  return res.data?.cart;
}

// 5. ADICIONAR AO CARRINHO
export async function addToCart(cartId, variantId) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { id checkoutUrl totalQuantity }
      }
    }
  `;
  const variables = { cartId, lines: [{ merchandiseId: variantId, quantity: 1 }] };
  const res = await shopifyFetch({ query, variables });
  return res.data?.cartLinesAdd?.cart;
}

// 6. REMOVER DO CARRINHO
export async function removeFromCart(cartId, lineId) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { id checkoutUrl totalQuantity }
      }
    }
  `;
  const res = await shopifyFetch({ query, variables: { cartId, lineIds: [lineId] } });
  return res.data?.cartLinesRemove?.cart;
}