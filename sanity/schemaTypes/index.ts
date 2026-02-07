import { type SchemaTypeDefinition } from 'sanity'
import { empresa } from './empresa'
import { cavalo } from './cavalo'
import { blockContentType } from './blockContentType'
import { artigoType } from './artigoType'
import { postType } from './postType'
import { authorType } from './authorType'
import { categoryType } from './categoryType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [empresa, cavalo, blockContentType, artigoType, postType, authorType, categoryType],
}
