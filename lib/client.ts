// @ts-nocheck
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../sanity/env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // 1. ALTERAÇÃO CRÍTICA: useCdn tem de ser false para permitir escritas (licitações)
  // e para que o Dashboard mostre os dados no segundo exato em que chegam.
  useCdn: false, 
  
  // 2. ADIÇÃO CRÍTICA: O token permite que este cliente "escreva" no teu Sanity.
  // Ele vai ler a variável SANITY_API_WRITE_TOKEN que configuraste no Vercel.
  token: process.env.SANITY_API_WRITE_TOKEN,
})