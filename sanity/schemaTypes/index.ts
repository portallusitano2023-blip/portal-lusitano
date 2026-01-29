import { type SchemaTypeDefinition } from 'sanity'
import { empresa } from './empresa'
import { cavalo } from './cavalo'
import { leilao } from './leilao'
import { blockContentType } from './blockContentType'
import { artigoType } from './artigoType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [empresa, cavalo, leilao, blockContentType, artigoType],
}