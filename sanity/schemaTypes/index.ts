import { type SchemaTypeDefinition } from 'sanity'
import { empresa } from './empresa'
import { cavalo } from './cavalo'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [empresa, cavalo],
}