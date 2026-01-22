'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logout() {
  const cookieStore = await cookies()
  
  // Apagar o "cartão de acesso"
  cookieStore.delete('shopify_customer_token')
  
  // Mandar de volta para o login
  redirect('/login')
}