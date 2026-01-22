'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// No topo do ficheiro src/app/login/actions.ts
const domain = "irdip0-dq.myshopify.com";
const storefrontAccessToken = "5566f8155086c19776145d6ff669019b";

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Por favor, preencha todos os campos.' };
  }

  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

  const variables = {
    input: { email, password }
  };

  try {
    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();
    const data = json.data?.customerAccessTokenCreate;

    if (data?.customerUserErrors?.length > 0) {
      return { error: 'Email ou password incorretos.' };
    }

    const token = data?.customerAccessToken?.accessToken;

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set('shopify_customer_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, 
        path: '/',
      });
    } else {
        return { error: 'Erro desconhecido ao comunicar com a loja.' };
    }

  } catch (error) {
    console.error(error);
    return { error: 'Erro de conexão. Tente novamente.' };
  }

  redirect('/minha-conta');
}