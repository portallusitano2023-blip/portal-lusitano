export async function getProducts() {
  const domain = "irdip0-dq.myshopify.com";
  
  // --- AQUI: Apaga o process.env... e cola o teu token entre aspas! ---
  const token = "COLA_AQUI_O_TEU_TOKEN_GIGANTE"; 
  
  const URL = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: `
          {
            products(first: 6) {
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
          }
        `,
      }),
      cache: "no-store", 
    });

    if (!response.ok) {
      console.error("Erro no Shopify:", response.statusText);
      return [];
    }

    const json = await response.json();
    return json.data.products.edges;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}