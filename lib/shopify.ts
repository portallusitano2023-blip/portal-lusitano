export async function getProducts() {
  // O endereço da tua loja
  const domain = "irdip0-dq.myshopify.com";
  
  // A TUA CHAVE DE STOREFRONT (Já inserida aqui - a correta!)
  const token = "5566f8155086c19776145d6ff669019b"; 
  
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
      // Isto garante que os dados são sempre frescos e evita erros do Vercel
      cache: "no-store", 
    });

    if (!response.ok) {
      // Se der erro, mostramos no log qual foi
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