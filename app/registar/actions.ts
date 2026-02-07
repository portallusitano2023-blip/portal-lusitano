'use server'

import { redirect } from 'next/navigation'

// 👇 HARDCODED: Coloquei os teus valores diretamente para garantir que funciona
const domain = "irdip0-dq.myshopify.com";
const storefrontAccessToken = "5566f8155086c19776145d6ff669019b";

export async function register(prevState: { error?: string } | null, formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log("--- TESTE COM VALORES DIRETOS ---");
  console.log("Domínio:", domain); // Agora isto vai aparecer preenchido!

  if (!email || !password || !firstName) {
    return { error: 'Preencha todos os campos obrigatórios.' };
  }

  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

  const variables = {
    input: { firstName, lastName, email, password }
  };

  try {
    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();
    
    if (json.errors) {
        console.error("Erro API:", json.errors);
        return { error: 'Erro de configuração da API.' };
    }

    const data = json.data?.customerCreate;

    if (data?.customerUserErrors?.length > 0) {
      // Retorna erro se o email já existir, etc.
      return { error: data.customerUserErrors[0].message };
    }

  } catch (error) {
    console.error(error);
    return { error: 'Erro de conexão.' };
  }

  redirect('/login?registado=sucesso');
}