import { type SchemaTypeDefinition } from 'sanity'
import { empresa } from './empresa'
import { cavalo } from './cavalo'
import { leilao } from './leilao' // 1. Importa aqui

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [empresa, cavalo, leilao], // 2. Adiciona aqui
}