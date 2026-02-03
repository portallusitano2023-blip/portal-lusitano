import { type SchemaTypeDefinition } from 'sanity'
import { empresa } from './empresa'
import { cavalo } from './cavalo'
import { blockContentType } from './blockContentType'
import { artigoType } from './artigoType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [empresa, cavalo, blockContentType, artigoType],
}
