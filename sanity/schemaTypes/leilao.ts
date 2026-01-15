import { defineField, defineType } from 'sanity'

export const leilao = defineType({
  name: 'leilao',
  title: 'Leilões',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título do Leilão',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cavalo',
      title: 'Cavalo para Leilão',
      type: 'reference',
      to: [{ type: 'cavalo' }], // Liga o leilão a um cavalo que já criaste
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lanceInicial',
      title: 'Lance Inicial (€)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dataFecho',
      title: 'Data e Hora de Fecho',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ativo',
      title: 'Leilão Ativo?',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})