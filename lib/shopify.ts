const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_TOKEN;

interface ShopifyFetchParams {
  query: string;
  variables?: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function shopifyFetch({ query, variables = {} }: ShopifyFetchParams): Promise<{ data: any }> {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;
  if (!domain || !storefrontAccessToken) return { data: null };
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
    return await response.json();
  } catch {
    return { data: null };
  }
}

export async function getProducts() {
  const query = `query { products(first: 20) { edges { node { id handle title images(first: 1) { edges { node { url } } } priceRange { minVariantPrice { amount } } } } } }`;
  const res = await shopifyFetch({ query });
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return (
    res.data?.products.edges.map((edge: any) => ({
      ...edge.node,
      images: edge.node.images.edges.map((img: any) => img.node),
    })) || []
  );
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export async function getProduct(handle: string) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: product.images.edges.map((e: any) => e.node),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variants: product.variants.edges.map((e: any) => e.node),
  };
}

// --- FUNÇÕES DE CARRINHO ---

export async function createCart() {
  const query = `mutation { cartCreate { cart { id checkoutUrl totalQuantity } } }`;
  const res = await shopifyFetch({ query });
  return res.data?.cartCreate?.cart;
}

export async function getCart(cartId: string) {
  const query = `query($cartId: ID!) { cart(id: $cartId) { id checkoutUrl totalQuantity lines(first: 10) { edges { node { id quantity merchandise { ... on ProductVariant { id title price { amount } product { title images(first: 1) { edges { node { url } } } } } } } } } } }`;
  const res = await shopifyFetch({ query, variables: { cartId } });
  return res.data?.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1) {
  const query = `mutation($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id checkoutUrl totalQuantity } } }`;
  const res = await shopifyFetch({
    query,
    variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
  });
  return res.data?.cartLinesAdd?.cart;
}

export async function removeFromCart(cartId: string, lineId: string) {
  const query = `mutation($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id checkoutUrl totalQuantity } } }`;
  const res = await shopifyFetch({ query, variables: { cartId, lineIds: [lineId] } });
  return res.data?.cartLinesRemove?.cart;
}

export async function updateCartLines(cartId: string, lineId: string, quantity: number) {
  const query = `mutation($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id checkoutUrl totalQuantity } } }`;
  const res = await shopifyFetch({
    query,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
  });
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

export async function getCustomer(accessToken: string) {
  const res = await shopifyFetch({ query: customerQuery, variables: { accessToken } });
  return res.data?.customer;
}
