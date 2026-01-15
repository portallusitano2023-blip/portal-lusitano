import { defineType, defineField } from 'sanity'

export const empresa = defineType({
  name: 'empresa',
  title: 'Empresa',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome da Empresa',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Link)',
      type: 'slug',
      options: {
        source: 'nome',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição',
      type: 'text',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
  ],
})