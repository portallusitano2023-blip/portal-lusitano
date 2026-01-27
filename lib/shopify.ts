// @ts-nocheck
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_TOKEN;

async function shopifyFetch({ query, variables = {} }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;
  if (!domain || !storefrontAccessToken) return { data: null };
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
    return { data: null };
  }
}

export async function getProducts() {
  const query = `query { products(first: 20) { edges { node { id handle title images(first: 1) { edges { node { url } } } priceRange { minVariantPrice { amount } } } } } }`;
  const res = await shopifyFetch({ query });
  return res.data?.products.edges.map(edge => ({ ...edge.node, images: edge.node.images.edges.map(img => img.node) })) || [];
}

export async function getProduct(handle) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        descriptionHtml
        images(first: 5) { edges { node { url } } }
        variants(first: 250) {
          edges {
            node {
              id
              title
              availableForSale
              price { amount }
              image { url }
            }
          }
        }
      }
    }
  `;
  const res = await shopifyFetch({ query, variables: { handle } });
  const product = res.data?.productByHandle;
  if (!product) return null;
  return {
    ...product,
    images: product.images.edges.map(e => e.node),
    variants: product.variants.edges.map(e => e.node)
  };
}

// --- FUNÇÕES DE CARRINHO ---

export async function createCart() {
  const query = `mutation { cartCreate { cart { id checkoutUrl totalQuantity } } }`;
  const res = await shopifyFetch({ query });
  return res.data?.cartCreate?.cart;
}

export async function getCart(cartId) {
  const query = `query($cartId: ID!) { cart(id: $cartId) { id checkoutUrl totalQuantity lines(first: 10) { edges { node { id quantity merchandise { ... on ProductVariant { id title price { amount } product { title images(first: 1) { edges { node { url } } } } } } } } } } }`;
  const res = await shopifyFetch({ query, variables: { cartId } });
  return res.data?.cart;
}

export async function addToCart(cartId, variantId) {
  const query = `mutation($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id checkoutUrl totalQuantity } } }`;
  const res = await shopifyFetch({ query, variables: { cartId, lines: [{ merchandiseId: variantId, quantity: 1 }] } });
  return res.data?.cartLinesAdd?.cart;
}

export async function removeFromCart(cartId, lineId) {
  const query = `mutation($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id checkoutUrl totalQuantity } } }`;
  const res = await shopifyFetch({ query, variables: { cartId, lineIds: [lineId] } });
  return res.data?.cartLinesRemove?.cart;
}

// ESTA ERA A FUNÇÃO QUE FALTAVA PARA MUDAR QUANTIDADES
export async function updateCartLines(cartId, lineId, quantity) {
  const query = `mutation($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id checkoutUrl totalQuantity } } }`;
  const res = await shopifyFetch({ query, variables: { cartId, lines: [{ id: lineId, quantity }] } });
  return res.data?.cartLinesUpdate?.cart;
}

// --- CLIENTE ---

const customerQuery = `
  query getCustomer($accessToken: String!) {
    customer(customerAccessToken: $accessToken) {
      id firstName lastName email phone
      defaultAddress { address1 city country zip }
      orders(first: 5, reverse: true) {
        edges { node { id orderNumber processedAt financialStatus fulfillmentStatus totalPrice { amount currencyCode } lineItems(first: 5) { edges { node { title quantity } } } } }
      }
    }
  }
`;

export async function getCustomer(accessToken) {
  const res = await shopifyFetch({ query: customerQuery, variables: { accessToken } });
  return res.data?.customer;
}